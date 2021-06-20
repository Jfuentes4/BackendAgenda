const  express = require('express');
const dotenv = require('dotenv');
const errorMiddleware = require('./middleware/errors');
const usersRouter = require('./routers/usersRouter');
const tasksRouter = require('./routers/tasksRouter');

dotenv.config({path: __dirname + '/.env.local'});
const PORT = process.env.PORT || 5000;
const app = express();
console.log(process.env.PORT);



//Async Routes Handlinggit
process.on('uncaughtException', (error) => {
    console.log(error);
});

process.on('unhandledRejection', (error) => {
    console.log(error);
});

//Middleware
app.use(express.json());

//Routers
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`listen on port ${PORT}`)
})