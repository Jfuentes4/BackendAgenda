const express = require('express');
const tasksRouter = express.Router();
const routeHelper = require('../routeHelper');
const validations = require('../middleware/validations');

//Obtener todas las tareas
tasksRouter.get('/', routeHelper((req, res) => {}));

//Obtener una tarea
tasksRouter.get('/:id', routeHelper((req, res) => {}));


//Crear una tarea
tasksRouter.post('/', validations.validate(validations.taskValidation) , routeHelper((req, res) => {
    res.status(201).json({
        status: 'ok',
    })
}));

//Actualizar una tarea
tasksRouter.put('/:id', routeHelper((req, res) => {}));

//Eliminar una tarea
tasksRouter.delete('/:id', routeHelper((req, res) => {}));

module.exports = tasksRouter;