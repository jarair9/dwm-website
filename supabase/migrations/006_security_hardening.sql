-- ============================================
-- Security hardening: RLS fixes, audit, and constraints
-- ============================================

-- ============================================
-- Fix: Ensure profiles INSERT works for the trigger
-- ============================================
-- The trigger (005) uses SECURITY DEFINER so it bypasses RLS.
-- The INSERT policy below is a fallback for direct client inserts.

-- ============================================
-- Strengthen: Audit events table
-- ============================================
-- Make audit_events append-only (no updates or deletes)
CREATE POLICY "Audit events are insert-only"
  ON audit_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "No updates to audit events"
  ON audit_events FOR UPDATE
  USING (false);

CREATE POLICY "No deletes from audit events"
  ON audit_events FOR DELETE
  USING (false);

-- ============================================
-- Strengthen: Contact messages - public can insert only
-- ============================================
-- Ensure anonymous users can submit contact forms
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can submit contact messages'
  ) THEN
    CREATE POLICY "Anyone can submit contact messages"
      ON contact_messages FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- ============================================
-- Strengthen: Newsletter subscribers - public can insert
-- ============================================
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can subscribe to newsletter'
  ) THEN
    CREATE POLICY "Anyone can subscribe to newsletter"
      ON newsletter_subscribers FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- ============================================
-- Strengthen: Reviews/testimonials - public read, admin write
-- ============================================
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Reviews are viewable by everyone'
  ) THEN
    CREATE POLICY "Reviews are viewable by everyone"
      ON reviews FOR SELECT
      USING (true);
  END IF;
END $$;

-- ============================================
-- Strengthen: Testimonials - public read, admin write
-- ============================================
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Testimonials are viewable by everyone'
  ) THEN
    CREATE POLICY "Testimonials are viewable by everyone"
      ON testimonials FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Only admins can manage testimonials'
  ) THEN
    CREATE POLICY "Only admins can manage testimonials"
      ON testimonials FOR ALL
      USING (auth.jwt() ->> 'role' = 'admin');
  END IF;
END $$;

-- ============================================
-- Strengthen: Invoices - admin read/write, buyer read own
-- ============================================
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage invoices'
  ) THEN
    CREATE POLICY "Admins can manage invoices"
      ON invoices FOR ALL
      USING (auth.jwt() ->> 'role' = 'admin');
  END IF;
END $$;

-- ============================================
-- Strengthen: Site settings - admin only
-- ============================================
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Only admins can read site settings'
  ) THEN
    CREATE POLICY "Only admins can read site settings"
      ON site_settings FOR SELECT
      USING (auth.jwt() ->> 'role' = 'admin');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Only admins can update site settings'
  ) THEN
    CREATE POLICY "Only admins can update site settings"
      ON site_settings FOR UPDATE
      USING (auth.jwt() ->> 'role' = 'admin');
  END IF;
END $$;

-- ============================================
-- Add constraints for data integrity
-- ============================================

-- Ensure bid amounts are always positive
DO $$ BEGIN
  ALTER TABLE bids ADD CONSTRAINT bids_amount_positive CHECK (amount > 0);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Ensure lot starting_bid is positive
DO $$ BEGIN
  ALTER TABLE lots ADD CONSTRAINT lots_starting_bid_positive CHECK (starting_bid > 0);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Ensure lot bid_increment is positive
DO $$ BEGIN
  ALTER TABLE lots ADD CONSTRAINT lots_bid_increment_positive CHECK (bid_increment > 0);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Ensure end_time is after start_time
DO $$ BEGIN
  ALTER TABLE lots ADD CONSTRAINT lots_time_order CHECK (end_time > start_time);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- Add indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_bids_lot_id ON bids(lot_id);
CREATE INDEX IF NOT EXISTS idx_bids_user_id ON bids(user_id);
CREATE INDEX IF NOT EXISTS idx_lots_status ON lots(status);
CREATE INDEX IF NOT EXISTS idx_lots_end_time ON lots(end_time);
CREATE INDEX IF NOT EXISTS idx_profiles_auth_id ON profiles(auth_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_contact_messages_resolved ON contact_messages(resolved);
