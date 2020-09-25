CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    ip_address VARCHAR(64) NOT NULL,
    score INTEGER NOT NULL
);