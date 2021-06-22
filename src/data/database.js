const db = require('mariadb');

//creacion de la pool de peticiones de la base de datos
const pool = db.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'scheduleManager',
    password: process.env.DB_PASS || 'portalxr01',
    database: process.env.DB_NAME || 'agenda',
    connectionLimit: 5,
});

//console.log(process.env.DB_HOST)
//creacion de conexion y gestion de errores de la BD
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

//funcion para convertir tipos date(javascript) a date(mariadb)
function getSqlDate (dateIn) {
    var pad = function(num) { return ('00'+num).slice(-2) };
    var date;
    date = new Date(dateIn);
    date = date.getUTCFullYear()     + '-' +
        pad(date.getUTCMonth() + 1)  + '-' +
        pad(date.getUTCDate())       + ' ' +
        pad(date.getUTCHours())      + ':' +
        pad(date.getUTCMinutes())    + ':' +
        pad(date.getUTCSeconds());

    return date;
}

module.exports = {pool, getSqlDate};