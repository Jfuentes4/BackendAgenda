const express = require('express');
const usersRouter = express.Router();
const routeHelper = require('../routeHelper');
const validations = require('../middleware/validations');
const pool = require('../data/database');
const bcrypt = require('bcrypt');

usersRouter.get('/', routeHelper( async (req, res) => {
    let sqlQuery = 'SELECT id, email, password FROM users';
    let rows = await pool.query(sqlQuery, req.params.id);
    res.status(200).json(rows);
}));

usersRouter.get('/:id', routeHelper( async (req, res) => {
    let sqlQuery = 'SELECT id, email, password FROM users WHERE id=?';
    let rows = await pool.query(sqlQuery, req.params.id);
    if (rows.length > 0) {
        res.status(200).json(rows[0]);
    } else {
        res.status(404).json({
            status: 'error',
            message: 'user not found',
        });
    }
}));

usersRouter.post('/', routeHelper( async (req, res) => {
    const {email, password} = req.body; 
    const encryptedPass = await bcrypt.hash(password,14)
    const sqlQuery = 'INSERT INTO users (email, password) VALUES (?, ?)';
    const result = await pool.query(sqlQuery, [email, encryptedPass]);

    res.status(201).json({
        status: 'ok',
        userId: result.insertId,
    })
}));

usersRouter.put('/:id', routeHelper((req, res) => {}));

usersRouter.delete('/:id', routeHelper((req, res) => {}));


module.exports = usersRouter;
