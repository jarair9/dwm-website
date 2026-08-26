-- ============================================
-- Auto-create profile on user signup + Fix profiles RLS
-- ============================================

-- Create function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (auth_id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', null),
    coalesce(new.raw_user_meta_data ->> 'role', 'bidder')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Add INSERT policy for profiles (authenticated users can insert own profile)
-- This is a fallback; the trigger handles most cases
create policy "Authenticated users can insert own profile"
  on profiles for insert
  with check (auth.uid()::text = auth_id::text);

-- Add DELETE policy for profiles (admin only)
create policy "Only admins can delete profiles"
  on profiles for delete
  using (auth.jwt() ->> 'role' = 'admin');
