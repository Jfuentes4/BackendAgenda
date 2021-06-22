const yup = require('yup');
const ValidationError = require('../errors/validationError');
const { setLocale } = require('yup');

//creacion de diccionario de mensajes de la libreria YUP
setLocale({
  string: {
    matches: 'the password must be at least 8 characters with 1 uppercase and 1 number',
  },
  number: {
    min: ({ min }) => ({ key: 'field_too_short', values: { min } }),
    max: ({ max }) => ({ key: 'field_too_big', values: { max } }),
  },
});

//funcion tipo Helper para la validacion de las rutas
function validate (validation) {
    return (req, res, next) => {
        try {
            //console.log('entro')
            validation(req.body);

            next();
        } catch (err) {
            next(new ValidationError(err));
        }
    } 
}

//validacion para las entradas de tareas via post
function taskValidation (data) {
    const taskSchema = yup.object().shape({
        title: yup.string().max(80).required(),
        date: yup.date().min(new Date(Date.now())).required(),
        description: yup.string().required(),
    });

    taskSchema.validateSync(data);
}

//validacion para las entradas de usuarios via post
function userValidation (data) {
    const userSchema = yup.object().shape({
        username: yup.string().min(5).max(30).required(),
        password: yup.string().min(10).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g).required(),
        email: yup.string().email().required(),
    });

    userSchema.validateSync(data);
}

//validacion para las entradas de login via post
function loginValidation (data) {
    const userSchema = yup.object().shape({
        password: yup.string().min(10).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g).required(),
        email: yup.string().email().required(),
    });

    userSchema.validateSync(data);
}


//validacion de autentificacion usando JWT
function authValidation () {
    return (req, res, next) => {
        try {
            const bearerHeader = req.headers['authorization'];
            console.log(bearerHeader)
            if (typeof bearerHeader !== 'undefined') {
                const bearer = bearerHeader.split(' ');
                const bearerToken = bearer[1];
                req.token = bearerToken;
                next();
            } else {
                console.log('entro')
                res.status(403).json({
                    status: 'error',
                    message: 'access denied'
                });
            }
        } catch (err) {
            console.log('error')
            next(new ValidationError(err));
        }
    } 
}

module.exports = {
    validate,
    userValidation,
    taskValidation,
    loginValidation,
    authValidation,
}