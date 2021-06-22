const express = require('express');
const usersRouter = express.Router();
const {routeHelper, authHelper} = require('../routeHelper');
const validations = require('../middleware/validations');
const {pool} = require('../data/database');
const bcrypt = require('bcrypt');
const bouncer = require ("express-bouncer")(500, 900000);
const jwt = require('jsonwebtoken');

var jwtKey = "passphrase";
 
// Add white-listed addresses (optional)
bouncer.whitelist.push ("127.0.0.1");
 
// In case we want to supply our own error (optional)
bouncer.blocked = function (req, res, next, remaining)
{
    res.send (429, "Too many requests have been made, " +
        "please wait " + remaining / 1000 + " seconds");
};

async function ifExists (email) {
    let exists = false;
    let sqlQuery = 'SELECT username FROM users where email=?';
    let rows = await pool.query(sqlQuery, email);
    console.log(rows.length);
    if (rows.length > 0) {
        exists = true;
    } 
    return exists;
}

//obtiene todos los datos de los usuarios del sistema, es temporal solo para pruebas
usersRouter.get('/', routeHelper( async (req, res) => {
    let sqlQuery = 'SELECT id, username, email, password FROM users';
    let rows = await pool.query(sqlQuery, req.params.id);
    if (rows.length > 0) {
        res.status(200).json(rows);
    } else {
        res.status(404).json({
            status: 'error',
            message: 'users not found',
        });
    }
}));

//obtiene los datos del unico usuario,
usersRouter.get('/profile', validations.authValidation(), routeHelper( authHelper(
    async (req, res) => {
        let sqlQuery = 'SELECT id, username, email, password FROM users WHERE id=?';
        const {id} = req.authData;
        let rows = await pool.query(sqlQuery, id);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({
                status: 'error',
                message: 'user not found',
            });
        }
    }
)));

//añadir usuarios
usersRouter.post('/', bouncer.blocked, validations.validate(validations.userValidation), routeHelper( async (req, res) => {
    const {username, email, password} = req.body; 
    const encryptedPass = await bcrypt.hash(password,14)
    const sqlQuery = 'INSERT INTO users (email, password, username) VALUES (?, ?, ?)';
    const exist = await ifExists(email);

    if (!exist) {
        const result = await pool.query(sqlQuery, [email, encryptedPass, username]);
        res.status(201).json({
            status: 'ok',
            userId: result.insertId,
        });
    } else {
        res.status(400).json({
            status: 'error',
            message: 'this email already exists',
        });
    }
}));


//obtener token para la api
usersRouter.post('/login', bouncer.blocked, validations.validate(validations.loginValidation), routeHelper( async (req, res) => {
    const {email, password} = req.body; 
    const sqlQuery = 'SELECT email, id, username, password FROM users WHERE email=?';
    const result = await pool.query(sqlQuery, email);
//console.log(result);
    if (result.length > 0) {
        if (bcrypt.compare(password, result[0].password)){

            let user = {
                username: result[0].username,
                email: result[0].email,
                id: result[0].id
            };
            console.log(user);

            jwt.sign(user, jwtKey, (err, token) => {
                res.status(200).json({
                    status: 'ok',
                    auth: true,
                    token: token,
                });
            });
            
            
        } else {
            res.status(400).json({
                status: 'error',
                auth: false,
                message: 'incorrect user data',
            })
        }
    } else {
        res.status(404).json({
            status: 'error',
            auth: false,
            message: 'user not found',
        });
    }
}))


// actualizar usuario
usersRouter.put('/:id', validations.authValidation(), validations.validate(validations.userValidation), routeHelper( authHelper(
    async (req, res) => {
        const {username, password} = req.body;
        const nEmail = req.body.email;
        const encryptedPass = await bcrypt.hash(password,14)
        const {id, email} = req.authData;
        const sqlQuery = 'update users set username=?, email=?, password=? WHERE id=?';
        const exist = await ifExists(nEmail);

        if (!exist) {
            let rows = await pool.query(sqlQuery, [username, nEmail, encryptedPass, id]);
            console.log(rows);
            
            if (rows.affectedRows > 0) {
                
                res.status(200).json({
                    status: 'ok',
                    updated: true,
                });
            } else {
                res.status(404).json({
                    status: 'error',
                    updated: false,
                    message: 'user not found',
                });
            }
        } else {
            res.status(400).json({
                status: 'error',
                message: 'this email already exists',
            });
        }
    }
)));


//Eliminar usuario
usersRouter.delete('/:id', validations.authValidation(), routeHelper( authHelper(
    async (req, res) => {
        const sqlQuery = 'delete from users where users.id=?';
        const {id} = req.authData;
        let result = await pool.query(sqlQuery, id);
        console.log(result.affectedRows);
        if (result.affectedRows > 0) {
            res.status(200).json(
                {
                    status: 'ok',
                    deleted: true,
                }
            );
        } else {
            res.status(404).json({
                status: 'error',
                deleted: false,
                message: 'user not found',
            });
        }
    }
)));




module.exports = usersRouter;
