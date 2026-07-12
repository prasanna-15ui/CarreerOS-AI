-- Run this script in the Supabase SQL Editor to create the login_requests table

CREATE TABLE IF NOT EXISTS login_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  email text NOT NULL,
  role text NOT NULL,
  approval_status text NOT NULL DEFAULT 'pending', -- pending, approved, consumed, rejected
  token text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  approved_at timestamp with time zone
);

-- Note: We do not necessarily need RLS policies if we exclusively use the Service Role Key
-- to interact with this table from our secure API routes.
