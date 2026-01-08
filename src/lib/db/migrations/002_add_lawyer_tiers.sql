-- Add Tiers and Cooldown to Lawyers
-- Implements the 'Thunderdome' Logic

alter table lawyers 
add column if not exists subscription_tier text default 'standard' check (subscription_tier in ('founder', 'premium', 'standard')),
add column if not exists last_lead_taken_at timestamp with time zone,
add column if not exists cooldown_expires_at timestamp with time zone;

-- Index for faster lookup during lead distribution
create index if not exists idx_lawyers_tier on lawyers(subscription_tier);
create index if not exists idx_lawyers_cooldown on lawyers(cooldown_expires_at);

-- COMMENT: Policies for RLS should be added here in a real deployment
-- Example Logic (Pseudocode for Policy):
-- CREATE POLICY "Can Accept Lead" ON leads FOR UPDATE
-- USING (
--   (auth.uid() = lawyer_id) AND
--   (lawyers.cooldown_expires_at IS NULL OR lawyers.cooldown_expires_at < now()) AND
--   (
--      (lawyers.subscription_tier = 'founder') OR
--      (lawyers.subscription_tier = 'premium' AND (now() - leads.created_at) > interval '15 minutes') OR
--      (lawyers.subscription_tier = 'standard' AND (now() - leads.created_at) > interval '30 minutes')
--   )
-- );
