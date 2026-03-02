-- ============================================================
-- Jumbotail B2B E-Commerce Shipping Estimator — Database Schema
-- ============================================================

-- Drop tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS sellers CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;

-- -----------------------------------------------------------
-- Customers (Kirana Stores)
-- -----------------------------------------------------------
CREATE TABLE customers (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    phone           VARCHAR(20) NOT NULL,
    email           VARCHAR(255),
    address         TEXT,
    city            VARCHAR(100),
    state           VARCHAR(100),
    pincode         VARCHAR(10),
    lat             DOUBLE PRECISION NOT NULL,
    lng             DOUBLE PRECISION NOT NULL,
    gst_number      VARCHAR(20),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- Sellers
-- -----------------------------------------------------------
CREATE TABLE sellers (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    email           VARCHAR(255),
    address         TEXT,
    city            VARCHAR(100),
    state           VARCHAR(100),
    pincode         VARCHAR(10),
    lat             DOUBLE PRECISION NOT NULL,
    lng             DOUBLE PRECISION NOT NULL,
    gst_number      VARCHAR(20),
    rating          DECIMAL(2,1) DEFAULT 0.0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- Products (belong to a seller)
-- -----------------------------------------------------------
CREATE TABLE products (
    id              SERIAL PRIMARY KEY,
    seller_id       INTEGER NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    category        VARCHAR(100),
    price           DECIMAL(10,2) NOT NULL,
    weight_kg       DECIMAL(10,3) NOT NULL,
    dimension_l_cm  DECIMAL(10,2),
    dimension_w_cm  DECIMAL(10,2),
    dimension_h_cm  DECIMAL(10,2),
    sku             VARCHAR(50),
    stock_qty       INTEGER DEFAULT 0,
    image_url       VARCHAR(500),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- Warehouses
-- -----------------------------------------------------------
CREATE TABLE warehouses (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    address         TEXT,
    city            VARCHAR(100),
    state           VARCHAR(100),
    pincode         VARCHAR(10),
    lat             DOUBLE PRECISION NOT NULL,
    lng             DOUBLE PRECISION NOT NULL,
    capacity        INTEGER DEFAULT 10000,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- Orders
-- -----------------------------------------------------------
CREATE TABLE orders (
    id                  SERIAL PRIMARY KEY,
    customer_id         INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    seller_id           INTEGER NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    product_id          INTEGER REFERENCES products(id) ON DELETE CASCADE,
    warehouse_id        INTEGER REFERENCES warehouses(id),
    quantity            INTEGER NOT NULL DEFAULT 1,
    delivery_speed      VARCHAR(20) NOT NULL DEFAULT 'standard',
    transport_mode      VARCHAR(20),
    distance_km         DECIMAL(10,2),
    shipping_charge     DECIMAL(10,2),
    total_amount        DECIMAL(10,2),
    status              VARCHAR(50) DEFAULT 'pending',
    order_date          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_date       TIMESTAMP,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- Indexes for performance
-- -----------------------------------------------------------
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_seller ON orders(seller_id);
CREATE INDEX idx_orders_status ON orders(status);
