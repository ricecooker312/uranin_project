const Pool = require('pg').Pool

require('dotenv').config()

const devConfig = {
    user: process.env.PG_POOL_POSTGRES_USER,
    host: process.env.PG_POOL_POSTGRES_HOST,
    password: process.env.PG_POOL_POSTGRES_PASSWORD,
    database: process.env.PG_POOL_POSTGRES_DATABASE,
    port: process.env.PG_POOL_POSTGRES_PORT
}

const proConfig = {
    connectionString: process.env.DATABASE_URL
}

const pool = new Pool(devConfig)

module.exports = pool