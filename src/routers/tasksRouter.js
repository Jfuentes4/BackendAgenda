const express = require('express');
const tasksRouter = express.Router();
const {routeHelper, authHelper} = require('../routeHelper');
const validations = require('../middleware/validations');
const jwt = require('jsonwebtoken');
const {pool, getSqlDate} = require('../data/database');

var key = "passphrase";

//Obtener todas las tareas de un usuario
tasksRouter.get('/', validations.authValidation(), routeHelper( authHelper(
    async (req, res) => {
        let sqlQuery = 'SELECT id, title, description, date, userId FROM tasks where tasks.userId=?';
        const {id} = req.authData;
        let rows = await pool.query(sqlQuery, id);
        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({
                status: 'error',
                message: 'users not found',
            });
        }
    }
)));

//Obtener una tarea
tasksRouter.get('/:id', routeHelper( async (req, res) => {
    let sqlQuery = 'SELECT id, title, description, date, userId FROM tasks where tasks.id=?';
    const {id} = req.authData;
    let rows = await pool.query(sqlQuery, id);
    if (rows.length > 0) {
        res.status(200).json(rows);
    } else {
        res.status(404).json({
            status: 'error',
            message: `task don't exist`,
        });
    }
}));


//Crear una tarea
tasksRouter.post('/', validations.authValidation(), validations.validate(validations.taskValidation) , routeHelper( authHelper(
    async (req, res) => {
        const {title, date, description} = req.body; 
        console.log(req.authData)
        const {id} = req.authData;
        let dateFormatted = getSqlDate(Date(date));
        dateFormatted = dateFormatted.replace("/", "-")
        //userId = no se aun
        const sqlQuery = 'INSERT INTO tasks (title, date, description, userId) VALUES (?, ?, ?, ?)';
        const result = await pool.query(sqlQuery, [title, dateFormatted, description, id]);

        res.status(201).json({
            status: 'ok',
            taskId: result.insertId,
        });
    }
)));

//Actualizar una tarea
tasksRouter.put('/:id', validations.validate(validations.taskValidation), routeHelper( async (req, res) => {
    const {title, date, description} = req.body;
    let sqlQuery = 'UPDATE tasks SET title=?, date=?, description=? WHERE id=?';
    let rows = await pool.query(sqlQuery, [title, date, description, req.params.id]);
    if (rows.length > 0) {
        res.status(200).json(rows[0]);
    } else {
            res.status(404).json({
            status: 'error',
            message: `task don't exist`,
        });
    }
}));

//Eliminar una tarea
tasksRouter.delete('/:id', routeHelper( async (req, res) => {
    let sqlQuery = 'DELETE FROM tasks WHERE tasks.id=?';
    let rows = await pool.query(sqlQuery, req.params.id);
    if (rows.length > 0) {
        res.status(200).json(rows[0]);
    } else {
        res.status(404).json({
            status: 'error',
            message: `task don't exist`,
        });
    }
}));

module.exports = tasksRouter;