const db = require('mariadb');

const pool = db.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'scheduleManager',
    password: process.env.DB_PASS || 'portalxr01',
    database: process.env.DB_NAME || 'agenda',
    connectionLimit: 5,
});

console.log(process.env.DB_HOST)

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection lost');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused');
        } else {
            console.error('Database did something weird');
        }
    }
    if (connection)
    connection.release();

    return;
});

module.exports = pool;