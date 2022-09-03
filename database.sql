CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    age SMALLINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE refreshToken (
    token TEXT NOT NULL
);