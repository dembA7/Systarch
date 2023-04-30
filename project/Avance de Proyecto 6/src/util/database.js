const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'demba',
    database: 'systarch',
    password: '',
});

module.exports = pool.promise();