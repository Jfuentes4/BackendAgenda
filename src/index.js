const  express = require('express');
const dotenv = require('dotenv');
const errorMiddleware = require('./middleware/errors');
const usersRouter = require('./routers/usersRouter');
const tasksRouter = require('./routers/tasksRouter');
const winston = require('winston');
 

//configuracion de winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

//configuracion de variables de entorno usando dotenv
dotenv.config({path: __dirname + '/.env.local'});
const PORT = process.env.PORT || 5000;
const app = express();
console.log(process.env.PORT);



//Async Routes Handling
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

//Errors Middleware
app.use(errorMiddleware);

//App listenet
app.listen(PORT, () => {
    console.log(`listen on port ${PORT}`)
})

  