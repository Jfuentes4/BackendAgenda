const  express = require('express');
const dotenv = require('dotenv');
const errorMiddleware = require('./middleware/errors');
const usersRouter = require('./routers/usersRouter');
const tasksRouter = require('./routers/tasksRouter');
const winston = require('winston');
 
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

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

process.on('SIGINT', function() {
    server.close();
    // calling .shutdown allows your process to exit normally
    toobusy.shutdown();
    process.exit();
});

  