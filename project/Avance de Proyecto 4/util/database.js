const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'systarch',
    password: 'PyH-Q3a-WcG-GjW',
    port: 3306
});

module.exports = pool.promise();