-- Rollback Migration: Remove licensing feature
-- Description: Removes licensing-related columns and tables
-- Date: 2024-09-21

-- Remove indexes
DROP INDEX IF EXISTS idx_users_is_household_author;
DROP INDEX IF EXISTS idx_households_license_id;
DROP INDEX IF EXISTS idx_licenses_expires_at;
DROP INDEX IF EXISTS idx_licenses_used_at;
DROP INDEX IF EXISTS idx_licenses_key;

-- Remove foreign key constraint
ALTER TABLE households DROP CONSTRAINT IF EXISTS fk_households_license_id;

-- Remove columns
ALTER TABLE users DROP COLUMN IF EXISTS is_household_author;
ALTER TABLE households DROP COLUMN IF EXISTS license_id;

-- Drop licenses table
DROP TABLE IF EXISTS licenses;

-- Note: pgcrypto extension is left in place as other parts of the system may use it