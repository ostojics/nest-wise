-- Migration: Add licensing feature
-- Description: Creates licenses table and adds license_id to households, is_household_author to users
-- Date: 2024-09-21

-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create licenses table
CREATE TABLE IF NOT EXISTS licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    used_at TIMESTAMPTZ NULL,
    note TEXT NULL
);

-- Add license_id to households table
ALTER TABLE households ADD COLUMN IF NOT EXISTS license_id UUID NOT NULL UNIQUE;

-- Add foreign key constraint
ALTER TABLE households ADD CONSTRAINT IF NOT EXISTS fk_households_license_id 
    FOREIGN KEY (license_id) REFERENCES licenses(id);

-- Add is_household_author to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_household_author BOOLEAN NOT NULL DEFAULT FALSE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(key);
CREATE INDEX IF NOT EXISTS idx_licenses_used_at ON licenses(used_at);
CREATE INDEX IF NOT EXISTS idx_licenses_expires_at ON licenses(expires_at);
CREATE INDEX IF NOT EXISTS idx_households_license_id ON households(license_id);
CREATE INDEX IF NOT EXISTS idx_users_is_household_author ON users(is_household_author);