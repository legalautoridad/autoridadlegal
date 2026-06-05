-- Migration to add ipaddress column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ipaddress TEXT;
