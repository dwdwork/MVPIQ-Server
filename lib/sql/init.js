const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost', // or your PostgreSQL host
    database: 'postgres',
    password: 'P0$tGr3$qL-SuPrUzR-2o23',
    port: 5432, // or your PostgreSQL port
});

module.exports = pool;