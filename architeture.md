# Full Auction System & Architecture — Supabase + Vercel (frontend-ready, admin-controlled, covers edge cases)

Below I map a concrete, production-ready auction system and architecture that connects to your existing frontend design (Next.js + Tailwind or similar), your admin panel, and Supabase. It enforces auction rules server-side, handles concurrency and anti-sniping, collects bidder contact info before the first bid, supports WhatsApp/email payment workflows (no Stripe), and includes an implementation plan AI can follow to build and test the site.

---

# 1 — Architecture Overview (logical)

```
Browser (Next.js frontend, public + admin)
  └─> Supabase Auth (client)
  └─> API layer (Serverless on Vercel / Supabase Edge Functions)  <-- holds service_role secret
        ├─> RPC: place_bid() (Postgres stored procedure)   ← atomic bid logic, anti-snipe, validation
        ├─> Webhook/Worker: end_auction_processor
        └─> Notification service (email SMTP or SendGrid; WhatsApp via Business API/Twilio/Message link)
  └─> Supabase Realtime (pub/sub) → frontend live updates (bids, auction state)
  └─> Supabase Postgres (main DB: auctions, bids, products, users, banners, audit)
  └─> CDN (Vercel / image CDN)
Monitoring / Logging / Backup
```

Key principles:

* **All bid placement and core auction rules happen server-side** in a single atomic RPC (Postgres function) invoked only from a trusted server (Vercel function or Supabase Edge Function) using the service role key.
* **Frontend only requests bid; server validates**: auction status, time, increments, concurrency.
* **Realtime updates** are pushed by database changes (Supabase Realtime) so all clients show the new highest bid instantly.
* **Admin controls** handled via role-based access and server-side checks (RLS + admin-only endpoints).
* **Payments**: entirely manual / offline — after auction win, system generates invoice/checkout instructions sent via WhatsApp/email; payments are confirmed manually by admin, and the payment status is recorded.

---

# 2 — Data Model (Postgres table schema, with key fields and constraints)

Below are compact SQL table definitions. They include indexes and important constraints — adapt types/fields for your product metadata.

```sql
-- users / bidders
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  full_name text,
  phone text,
  whatsapp text,
  role text not null default 'bidder', -- bidder, admin, seller
  created_at timestamptz default now()
);

-- products / lots (gemstones, minerals)
create table products (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  title text not null,
  description text,
  category_id uuid,
  images text[], -- urls
  metadata jsonb, -- carat, weight, certification, origin etc.
  created_at timestamptz default now()
);

-- categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  parent_id uuid
);

-- auctions
create table auctions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  seller_id uuid references users(id),
  start_time timestamptz not null,
  end_time timestamptz not null,
  starting_price numeric(12,2) not null default 0,
  reserve_price numeric(12,2),
  min_increment numeric(12,2) not null default 10, -- currency units
  status text not null default 'scheduled', -- scheduled, live, closed, cancelled
  buy_now_price numeric(12,2),
  created_at timestamptz default now()
);

-- bids (append-only)
create table bids (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid references auctions(id) on delete cascade,
  bidder_id uuid references users(id),
  amount numeric(12,2) not null,
  placed_at timestamptz default now(),
  meta jsonb, -- e.g. {source:'web', ip:'x.x.x.x'}
  constraint positive_amount check (amount > 0)
);

create index on bids (auction_id, placed_at desc);
create index on auctions (status, start_time, end_time);

-- audit log (immutable history)
create table audit_events (
  id serial primary key,
  event_type text not null,
  event_time timestamptz default now(),
  payload jsonb
);
```

Notes:

* Use `numeric(12,2)` for currency to avoid float imprecision.
* `bids` is append-only; never overwrite past bids.
* Keep `audit_events` for forensics and dispute resolution.

---

# 3 — Core Server-Side Logic (RPC: place_bid)

Put all bid validation and insertion inside a single Postgres stored procedure (RPC) so it runs atomically. The serverless function invokes this RPC with the Supabase service role key.

Key validations in `place_bid`:

* Auction exists and status == 'live'
* Current server time between start_time and end_time
* Incoming `amount` >= current_highest + min_increment (or >= starting_price if no bids)
* Prevent simultaneous race conditions (lock auction row FOR UPDATE)
* Anti-sniping: if bid placed within `anti_sniping_window` (e.g., 2 minutes) extend `end_time` by `extension_seconds`
* Insert bid, publish event (via NOTIFY or writing to a queue table)
* Return success or well-typed error code

Example simplified SQL function:

```sql
create or replace function public.place_bid(
  p_auction_id uuid,
  p_bidder_id uuid,
  p_amount numeric
) returns TABLE(success boolean, message text, new_end_time timestamptz) as $$
declare
  cur_auction record;
  current_high numeric;
  cur_time timestamptz := now();
  anti_sniping_window interval := '2 minutes';
  extension interval := '2 minutes';
begin
  select * into cur_auction from auctions where id = p_auction_id for update;

  if not found then
    return query select false, 'auction_not_found', null;
  end if;

  if cur_auction.status <> 'live' then
    return query select false, 'auction_not_live', null;
  end if;

  if cur_time < cur_auction.start_time then
    return query select false, 'auction_not_started', null;
  end if;

  if cur_time >= cur_auction.end_time then
    return query select false, 'auction_ended', null;
  end if;

  select max(amount) into current_high from bids where auction_id = p_auction_id;
  if current_high is null then
    current_high := cur_auction.starting_price - cur_auction.min_increment;
  end if;

  if p_amount < current_high + cur_auction.min_increment then
    return query select false, 'bid_too_low', null;
  end if;

  -- insert bid
  insert into bids(auction_id, bidder_id, amount)
    values (p_auction_id, p_bidder_id, p_amount);

  -- anti-sniping: extend end_time if needed
  if cur_auction.end_time - cur_time <= anti_sniping_window then
    update auctions set end_time = cur_auction.end_time + extension
      where id = p_auction_id;
    cur_auction.end_time := cur_auction.end_time + extension;
  end if;

  -- write audit event
  insert into audit_events(event_type, payload) values('bid_placed', json_build_object(
    'auction_id', p_auction_id,
    'bidder_id', p_bidder_id,
    'amount', p_amount
  ));

  -- Optionally: perform NOTIFY for Realtime clients (Supabase Realtime listens to table changes)
  return query select true, 'ok', cur_auction.end_time;
end;
$$ language plpgsql security definer;
```

Security note: mark the function `security definer` and call it only from the server with the service role key.

---

# 4 — API Layer / Trusted Endpoints

Do **not** allow clients to call the `place_bid` RPC with the service_role key directly from the browser. Instead:

* Deploy a Vercel Serverless Function (or Supabase Edge Function) `/api/place-bid` that:

  * Accepts client requests with Supabase `access_token` (user JWT) in Authorization header.
  * Verifies token with Supabase Auth (optional: or derive bidder_id from token).
  * Calls `place_bid` RPC with the `service_role` key.
  * Returns response codes and messages to client.
  * Logs the attempt and reasons for failure.
  * Implement rate limiting / idempotency per user per auction to avoid spam.

API surface (examples):

* `POST /api/place-bid` { auction_id, amount }
* `POST /api/admin/create-auction` (admin only)
* `POST /api/admin/end-auction` (force close) — admin-only
* `GET /api/auction/[id]` (SSR-friendly endpoint to fetch auction + latest bid)

Security:

* Serverless functions hold sensitive keys (service role) and must be environment-protected.
* Use JWT verification to ensure user is who they say they are.

---

# 5 — Frontend Integration (flows & UX)

## Bid Workflow & bidder info collection (required by you)

* When a logged-in user clicks **Place Bid**:

  1. Check if user profile has required contact info (name, email, phone OR WhatsApp). If not, present a modal form **before** placing the first bid.

     * Form fields: Full name (required), Email (required), Phone (required), WhatsApp (optional).
     * Validate format client-side; save to `users` table via `PATCH /api/profile` (or use Supabase client).
  2. Once required info saved, show the bid confirmation modal with:

     * Auction summary (current highest, your bid, countdown)
     * “I confirm to pay via WhatsApp/email if I win” checkbox
     * Place Bid (button)
  3. On click, call `/api/place-bid` serverless endpoint.
  4. Show immediate optimistic UI feedback:

     * “Bid placed — awaiting server confirmation”
     * On success: show toast + realtime update
     * On failure: show clear message (bid too low, auction ended, etc.) and revert UI

UX details:

* Disable Place Bid while request in-flight.
* Provide clear inline messages for reasons (e.g., "current highest is X, min increment Y").
* If user gets outbid, show a small inline banner nudging re-bid.

## Admin Panel Flows

* Full CRUD for auctions, products, categories, banners, users.
* Admin can:

  * Force-close auctions
  * Adjust reserve price (with caution — show audit)
  * Mark payment as received (manually) and change auction status to `settled`
  * Send invoice / WhatsApp message from admin UI (templates + preview)
  * Export CSV of winners & contact info

---

# 6 — Payment & Settlement Flow (WhatsApp / Email, no Stripe)

**Post-auction winner flow (manual):**

1. Auction closes (server triggers `end_auction_processor` worker).
2. Worker selects highest bid (`SELECT ... ORDER BY amount DESC LIMIT 1`).
3. System sets auction.status = 'closed' and writes winner info to `auctions.winner_id`, `auctions.final_price`.
4. Worker sends a templated message:

   * **Email**: invoice with payment instructions, bank details, shipping, and contact.
   * **WhatsApp**: via Business API/Twilio or fallback: generate a prefilled message `https://wa.me/` link with the text and show in admin UI to click/send.
5. Admin/Treasury confirms payment when funds are received.
6. Admin marks auction `settled` and triggers shipping instructions to seller.

Data fields to add to auctions:

```sql
alter table auctions add column winner_id uuid;
alter table auctions add column final_price numeric(12,2);
alter table auctions add column payment_status text default 'pending'; -- pending, paid, failed
```

Payment verification options:

* Admin manually uploads proof (bank receipt image) or marks as paid.
* Optional: upload order/invoice number and change `payment_status`.

Templates (examples) included in admin UI for quick copy-to-WhatsApp or send-by-email.

---

# 7 — Realtime & Notifications

* Use Supabase Realtime to listen to `bids` table and `auctions` table changes to update UI.
* On outbid events: send real-time in-app push (toast) + optional email/WhatsApp notification (opt-in).
* On auction close: send email/WhatsApp to winner and seller.
* On account events (suspicious activity), notify admin via email.

Recommendation for WhatsApp:

* Use WhatsApp Business API or Twilio Conversations for automated templated messages (requires registration).
* If you want minimal friction, rely on `wa.me` links in initial MVP, then upgrade to Business API for automated sending.

---

# 8 — Admin Security & Controls

* Use Supabase Auth with role-based claims. Add `role` to `users` JWT metadata.
* Protect admin routes via Next.js middleware using `role === 'admin'`.
* Use Row-Level Security (RLS) policies for tables:

  * `bids`: insert allowed only via service_role RPC; or allow authenticated users only to insert for themselves but place_bid RPC recommended.
  * `auctions`: only admin can update status fields.
* Enforce MFA for admin accounts (password + TOTP).
* Audit everything in `audit_events`.
* Soft-deletes for products/auctions (add `deleted_at`) to avoid data loss.

Sample RLS snippet:

```sql
-- only admins can update auctions
alter table auctions enable row level security;

create policy "admins can update auctions" on auctions
  for update using (auth.role() = 'admin');
```

(Adjust auth.role() to your JWT claim resolver. Supabase requires `auth.role()` mapping via `current_setting('jwt.claims.role')` or similar.)

---

# 9 — Edge Cases & How to Handle Them (comprehensive)

**1. Simultaneous bids / race conditions**

* Use `FOR UPDATE` locking in RPC to serialize bid checks and insertion.
* Return clear error codes if a bid fails due to concurrency.

**2. User clock mismatch**

* Always use server time (`now()`) for countdown/timers. Frontend computes display using server offset retrieved once per session.

**3. Last-second sniping**

* Implement anti-sniping: if a bid placed within `anti_sniping_window` (e.g., 2 minutes) extend `end_time` by extension (e.g., +2 minutes). Show "Extended until [time]" banner.

**4. Network disconnect mid-bid**

* Frontend shows pending state; on reconnect, refresh auction from server and surface result (success/failure). Allow user to re-attempt.

**5. Bid too low**

* Server rejects and returns current_high and min_increment; UI should update instantly and offer "Auto-suggest next min bid".

**6. Auction edited while live**

* Disallow critical edits (start_time, end_time, min_increment) while `status == 'live'`. Admin UI must warn and require force flag; all forced edits are audited.

**7. Deleting active auction**

* Use soft-delete and require explicit force confirmation with reason. Audit the action.

**8. Fraud detection**

* Flag rapid bidding pattern or multiple accounts colluding — create automated rules to flag suspicious behavior and notify admin for manual review.

**9. Escrow / non-payment**

* Since payments are offline, have a policy: auto-cancel or escalate if payment not received within X days. Admin marks as defaulted, relists item or contacts next bidder.

**10. Timezones**

* Store all timestamps in UTC; show localized time on frontend using user's browser timezone (but always display server time as canonical).

**11. Image/asset CDN failures**

* Provide fallback low-res placeholder images, and show helpful UI instead of broken images.

**12. Legal/certification documents**

* Allow admins to upload PDFs for certification; show those in product modal (download/view).

---

# 10 — Observability, Backups & Reliability

* **Backups**: enable daily DB backups and point-in-time recovery on Supabase.
* **Monitoring**:

  * Log errors from serverless functions to Sentry.
  * Track key metrics: active auctions, bids/sec, latency on place_bid RPC, failed bids.
* **Rate limiting**:

  * Throttle per-user bid attempts (e.g., 5 bids / 10s) in serverless function.
* **Load**:

  * Use Vercel autoscaling; ensure DB has connection pooling.
* **Testing / Canary**:

  * Use a staging schema and perform load testing on place_bid RPC.

---

# 11 — Deployment & Infra Notes (Vercel + Supabase)

* Environment variables:

  * `SUPABASE_URL`, `SUPABASE_KEY` (service role for serverless only).
  * Email SMTP credentials, WhatsApp API keys (if used).
* Host frontend on Vercel (App Router) with edge middleware for admin protection.
* Host serverless endpoints on Vercel or Supabase Edge Functions (both acceptable).
* Use Vercel’s image CDN or Next.js Image Optimization for large gem photos.
* Configure CORS and CSP to whitelist your domain.

---

# 12 — Implementation Plan (ordered steps AI can follow — no time estimates)

Break into phases; each phase is a vertical slice delivering working functionality.

**Phase A — Foundations**

1. Create Supabase project and basic tables (users, products, categories, auctions, bids, audit_events).
2. Configure Supabase Auth and create initial admin user.
3. Set up RLS skeleton and service_role usage plan.
4. Seed example products and auctions for development.

**Phase B — RPC & Serverless**

1. Implement `place_bid` Postgres function with locking and anti-snipe logic.
2. Build serverless endpoint `/api/place-bid` that:

   * Verifies JWT (optionally),
   * Calls `place_bid` using service role,
   * Logs responses and errors.
3. Build `end_auction_processor` serverless/cron job that:

   * Detects ended auctions,
   * Determines winner,
   * Writes winner info + final_price,
   * Enqueues notifications.

**Phase C — Frontend Core**

1. Integrate Supabase client for auth and profile.
2. Build auction list + detail pages (SSR/ISR as appropriate).
3. Implement bid modal and pre-bid contact-collection modal.
4. Integrate realtime subscriptions to `bids` and `auctions`.
5. Implement countdown UI based on server time offset.

**Phase D — Admin Panel**

1. Admin layout, JWT/middleware guard.
2. CRUD for auctions/products/categories/banners.
3. Audit viewer & logs.
4. Payment status UI and invoice/WhatsApp templates.

**Phase E — Notifications & Payments**

1. Email templates and SMTP integration (send invoice).
2. Integrate WhatsApp sending or build prefilled `wa.me` flows.
3. Implement admin verification flow for payment marking.

**Phase F — Hardening & Ops**

1. Add rate-limiting & abuse detection.
2. Add backups, monitoring, Sentry integration.
3. Add tests: unit tests for RPC logic, integration tests for the full bid flow.
4. Load-testing on `place_bid` to validate lock/throughput.

**Phase G — Launch Checklist**

1. Confirm RLS & keys locked down.
2. Create admin runbook for manual payment flows and disputes.
3. Setup domain, TLS, and CDN.
4. Smoke test live auctions and end-of-auction processing.

---

# 13 — Example Frontend Code Snippets (conceptual)

### Pre-bid modal pseudocode

```tsx
// On "Place Bid" click:
if (!user.full_name || !user.email || !user.phone) {
  showModal(<CollectContactInfo onSave={saveProfileAndContinue} />);
} else {
  showModal(<ConfirmBidModal auction={auction} amount={amount} />);
}
```

### Calling serverless endpoint (simplified)

```ts
const res = await fetch('/api/place-bid', {
  method: 'POST',
  headers: {
    'Content-Type':'application/json',
    Authorization: `Bearer ${supabaseSession.access_token}`
  },
  body: JSON.stringify({ auction_id, amount })
});
const data = await res.json();
if (!data.success) handlePlaceBidError(data.message);
```

---

# 14 — Testing & QA (what to test)

* Unit tests for `place_bid` RPC: valid bid, too-low bid, simultaneous bids, anti-snipe extension.
* Integration test: full flow from frontend bid to DB insertion to realtime update.
* Edge-case tests: auction end during bid; bid after end returns error; admin force-close.
* Security tests: RLS policy tests, ensure non-admin cannot call admin endpoints.
* Load tests: burst bidding during last minute.

---

# 15 — Logging & Escalation (disputes)

* Provide admin “dispute” interface where bidder/seller can open a dispute; store supporting docs.
* Preserve full audit trail for each auction: all bids, admin edits, communications.
* Keep immutable `audit_events` for forensic analysis.

---

# 16 — Summary: Critical Guarantees this architecture provides

* **Correctness** — bid logic enforced atomically in DB RPC (no client side trust).
* **Realtime UX** — Supabase Realtime updates keep all UIs in sync with minimal latency.
* **Security** — RLS + serverless service_role pattern prevents privilege escalation.
* **Anti-sniping** — auction extension in server logic prevents last-second unfair wins.
* **Manual payments** — invoices & WhatsApp/email workflows built-in; admin-managed settlement.
* **Resilience & Observability** — backups, monitoring, audit logs, tests, and dispute workflows.
