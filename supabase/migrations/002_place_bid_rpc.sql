-- ============================================
-- place_bid RPC — Atomic bid placement with anti-sniping
-- ============================================

create or replace function public.place_bid(
  p_auction_id uuid,
  p_bidder_id uuid,
  p_amount numeric
) returns table(success boolean, message text, new_end_time timestamptz) as $$
declare
  cur_auction record;
  current_high numeric;
  cur_time timestamptz := now();
  anti_sniping_window interval := '2 minutes';
  extension interval := '2 minutes';
begin
  -- Lock auction row to prevent race conditions
  select * into cur_auction from auctions where id = p_auction_id for update;

  if not found then
    return query select false, 'auction_not_found'::text, null::timestamptz;
    return;
  end if;

  if cur_auction.status <> 'live' then
    return query select false, 'auction_not_live'::text, null::timestamptz;
    return;
  end if;

  if cur_time < cur_auction.start_time then
    return query select false, 'auction_not_started'::text, null::timestamptz;
    return;
  end if;

  if cur_time >= cur_auction.end_time then
    return query select false, 'auction_ended'::text, null::timestamptz;
    return;
  end if;

  -- Get current highest bid
  select max(amount) into current_high from bids where auction_id = p_auction_id;

  if current_high is null then
    current_high := cur_auction.starting_price - cur_auction.min_increment;
  end if;

  -- Validate bid amount
  if p_amount < current_high + cur_auction.min_increment then
    return query select false, 'bid_too_low'::text, null::timestamptz;
    return;
  end if;

  -- Insert the bid
  insert into bids(auction_id, bidder_id, amount)
    values (p_auction_id, p_bidder_id, p_amount);

  -- Anti-sniping: extend end_time if bid placed within window
  if cur_auction.end_time - cur_time <= anti_sniping_window then
    update auctions set end_time = cur_auction.end_time + extension
      where id = p_auction_id;
    cur_auction.end_time := cur_auction.end_time + extension;
  end if;

  -- Audit event
  insert into audit_events(event_type, payload) values('bid_placed', jsonb_build_object(
    'auction_id', p_auction_id,
    'bidder_id', p_bidder_id,
    'amount', p_amount
  ));

  return query select true, 'ok'::text, cur_auction.end_time;
end;
$$ language plpgsql security definer;
