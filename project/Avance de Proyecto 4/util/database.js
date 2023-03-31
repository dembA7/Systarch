const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'systarch',
    database: 'systarch',
    password: '',
    port: 3306
});

module.exports = pool.promise();