-- GDI Alquileres MVP V6 - PostgreSQL starter schema
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  role VARCHAR(30) NOT NULL,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(180) UNIQUE NOT NULL,
  phone VARCHAR(60),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE properties (
  id BIGSERIAL PRIMARY KEY,
  owner_user_id BIGINT NOT NULL REFERENCES users(id),
  type VARCHAR(40) NOT NULL,
  name VARCHAR(160) NOT NULL,
  address VARCHAR(220) NOT NULL,
  city VARCHAR(120),
  status VARCHAR(30) DEFAULT 'active'
);

CREATE TABLE tenants (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  name VARCHAR(160) NOT NULL,
  dni VARCHAR(30),
  cuil VARCHAR(30),
  email VARCHAR(180),
  phone VARCHAR(60)
);

CREATE TABLE leases (
  id BIGSERIAL PRIMARY KEY,
  property_id BIGINT NOT NULL REFERENCES properties(id),
  tenant_id BIGINT NOT NULL REFERENCES tenants(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  base_rent NUMERIC(14,2) NOT NULL,
  due_day INT NOT NULL,
  adjustment_method VARCHAR(60),
  adjustment_frequency INT,
  late_fee_type VARCHAR(20) DEFAULT 'daily',
  late_fee_rate NUMERIC(10,4) DEFAULT 0,
  grace_days INT DEFAULT 0,
  status VARCHAR(30) DEFAULT 'active'
);

CREATE TABLE guarantors (
  id BIGSERIAL PRIMARY KEY,
  lease_id BIGINT NOT NULL REFERENCES leases(id),
  name VARCHAR(160) NOT NULL,
  dni VARCHAR(30),
  cuil VARCHAR(30),
  guarantee_type VARCHAR(60),
  review_status VARCHAR(30) DEFAULT 'pending'
);

CREATE TABLE charges (
  id BIGSERIAL PRIMARY KEY,
  lease_id BIGINT NOT NULL REFERENCES leases(id),
  period VARCHAR(7) NOT NULL,
  concept VARCHAR(60) NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(30) DEFAULT 'pending'
);

CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  lease_id BIGINT NOT NULL REFERENCES leases(id),
  amount NUMERIC(14,2) NOT NULL,
  paid_at TIMESTAMPTZ,
  method VARCHAR(40),
  external_reference VARCHAR(120),
  provider VARCHAR(40),
  provider_payment_id VARCHAR(120),
  provider_status VARCHAR(40),
  verification_status VARCHAR(40) DEFAULT 'pending'
);

CREATE TABLE receipts (
  id BIGSERIAL PRIMARY KEY,
  payment_id BIGINT NOT NULL REFERENCES payments(id),
  number VARCHAR(40) UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT now(),
  pdf_path TEXT
);

CREATE TABLE documents (
  id BIGSERIAL PRIMARY KEY,
  entity_type VARCHAR(40) NOT NULL,
  entity_id BIGINT NOT NULL,
  document_type VARCHAR(60),
  storage_path TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE adjustments (
  id BIGSERIAL PRIMARY KEY,
  lease_id BIGINT NOT NULL REFERENCES leases(id),
  effective_date DATE NOT NULL,
  method VARCHAR(60),
  source VARCHAR(120),
  previous_rent NUMERIC(14,2),
  new_rent NUMERIC(14,2)
);
