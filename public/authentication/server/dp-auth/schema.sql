-- server/dp-auth/schema.sql

-- DP-Auth System Database Schema
-- Delight Pack Digital Ecosystem

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_level INTEGER NOT NULL CHECK (role_level BETWEEN 1 AND 5),
    profile_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(512) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

-- Tally Prime stock items synced from local bridge
CREATE TABLE IF NOT EXISTS tally_stock_items (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) UNIQUE NOT NULL,
    closing_balance NUMERIC(18, 4) DEFAULT 0,
    base_units VARCHAR(50),
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tally_stock_items_name ON tally_stock_items(item_name);

-- Role Levels Reference:
-- 1: User (External clients/guests)
-- 2: Member (Sales reps/Customer service)
-- 3: Staff (Internal operations)
-- 4: Admin (Full business control)
-- 5: Developer (Full read/write/execute)
