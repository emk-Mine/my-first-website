CREATE TABLE IF NOT EXISTS products (
    product_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    phone TEXT,
    private_link TEXT
);

CREATE TABLE IF NOT EXISTS orders (
    reference TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ZMW',
    status TEXT NOT NULL DEFAULT 'pending',
    access_token_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);