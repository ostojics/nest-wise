-- Development: Create test license keys
-- Description: Creates sample license keys for testing
-- Usage: Run this after the main migration to create test data

-- Create a license that expires in 1 year
INSERT INTO licenses (key, expires_at, note) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', NOW() + INTERVAL '1 year', 'Test license - expires in 1 year'),
    ('6ba7b810-9dad-11d1-80b4-00c04fd430c8', NOW() + INTERVAL '1 year', 'Test license 2 - expires in 1 year'),
    ('6ba7b811-9dad-11d1-80b4-00c04fd430c8', NOW() + INTERVAL '6 months', 'Test license 3 - expires in 6 months');

-- Create an expired license for testing expired behavior
INSERT INTO licenses (key, expires_at, note) VALUES 
    ('expired-test-key-000000000000000', NOW() - INTERVAL '1 day', 'Expired test license');

-- Create a used license for testing used behavior  
INSERT INTO licenses (key, expires_at, used_at, note) VALUES 
    ('used-test-key-00000000000000000', NOW() + INTERVAL '1 year', NOW() - INTERVAL '1 hour', 'Used test license');

-- Display created licenses
SELECT 
    key,
    expires_at,
    used_at,
    note,
    CASE 
        WHEN used_at IS NOT NULL THEN 'USED'
        WHEN expires_at < NOW() THEN 'EXPIRED'
        ELSE 'ACTIVE'
    END as status
FROM licenses
ORDER BY created_at;