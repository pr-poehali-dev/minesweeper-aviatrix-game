
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(64) UNIQUE NOT NULL,
  nickname VARCHAR(64) DEFAULT 'Игрок',
  balance NUMERIC(12,2) DEFAULT 100.00,
  is_admin BOOLEAN DEFAULT FALSE,
  bonus_claimed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deposits (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(64) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS withdrawals (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(64) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  sbp_phone VARCHAR(32) NOT NULL,
  bank_name VARCHAR(64) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS support_messages (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(64) NOT NULL,
  text TEXT NOT NULL,
  from_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (session_id, nickname, balance, is_admin, bonus_claimed)
VALUES ('admin_master_777', 'Администратор', 999999.00, TRUE, TRUE)
ON CONFLICT (session_id) DO NOTHING;
