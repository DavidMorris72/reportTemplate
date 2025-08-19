-- Database setup script for Neon PostgreSQL
-- Run this script in your Neon database console or via psql

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    hashed_password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'SUPER_ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user (password: dmorris)
INSERT INTO users (email, name, hashed_password, role) VALUES 
('admin@example.com', 'Super Admin', '$2b$12$nkQLY.voIUhjZLdpFba8GOIC2xFbBWL5A6AjkCNdztLSnfDluob4i', 'SUPER_ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Insert default user (password: dmsi1234)
INSERT INTO users (email, name, hashed_password, role) VALUES 
('user@example.com', 'Default User', '$2b$12$v/avwbrhhdRZTfF430sgaOsJVGdXyn08LMhoX.2TGMpbjLwH.C0z2', 'USER')
ON CONFLICT (email) DO NOTHING;

-- Verify the setup
SELECT 'Database setup complete!' as status;
SELECT email, name, role, created_at FROM users;