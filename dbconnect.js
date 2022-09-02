const Pool = require('pg').Pool

require('dotenv').config()

const pool = new Pool({
    user: process.env.PG_POOL_POSTGRES_USER,
    host: process.env.PG_POOL_POSTGRES_HOST,
    password: process.env.PG_POOL_POSTGRES_PASSWORD,
    database: process.env.PG_POOL_POSTGRES_DATABASE,
    port: process.env.PG_POOL_POSTGRES_PORT
})

module.exports = pool