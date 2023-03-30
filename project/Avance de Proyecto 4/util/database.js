const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'types-agree.at.ply.gg',
    user: 'systarch',
    database: 'systarch',
    password: '',
    port: 23463
});

module.exports = pool.promise();