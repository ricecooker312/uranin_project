CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    age SMALLINT NOT NULL,
    verified BOOLEAN DEFAULT FALSE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS refreshToken (
    token TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS club (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price_to_join INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    members VARCHAR[] NOT NULL,
    leader VARCHAR NOT NULL,
    
    CONSTRAINT leader_fk
        FOREIGN KEY (leader)
            REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE ac