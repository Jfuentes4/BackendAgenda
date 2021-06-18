const  express = require('express');
const app = express();

const port = 5000;

//Obtener usuarios
app.get('/users', (req, res) => {});

//Obtener todas las tareas
app.get('/user/tasks', (req, res) => {});

//Obtener una tareas
app.get('/user/task', (req, res) => {});


//Crear una tarea
app.post('/user/tasks', (req, res) => {
    res.status(201)
});

//Actualizar una tarea
app.put('/user/task', (req, res) => {});

//Eliminar una tarea
app.delete('/user/task', (req, res) => {});

app.listen(port, () => {
    console.log(`listen on port ${port}`)
})