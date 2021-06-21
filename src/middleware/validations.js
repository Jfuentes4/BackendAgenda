const yup = require('yup');
const ValidationError = require('../errors/validationError');
const { setLocale } = require('yup');

setLocale({
  string: {
    matches: 'the password must be at least 8 characters with 1 uppercase and 1 number',
  },
  number: {
    min: ({ min }) => ({ key: 'field_too_short', values: { min } }),
    max: ({ max }) => ({ key: 'field_too_big', values: { max } }),
  },
});

function validate (validation) {
    return (req, res, next) => {
        try {
            validation(req.body);

            next();
        } catch (err) {
            next(new ValidationError(err));
        }
    } 
}

function taskValidation (data) {
    const taskSchema = yup.object().shape({
        title: yup.string().max(80).required(),
        date: yup.date().min(new Date(Date.now())).required(),
        description: yup.string().required(),
    });

    taskSchema.validateSync(data);
}

function userValidation (data) {
    const userSchema = yup.object().shape({
        username: yup.string().min(5).max(30).required(),
        password: yup.string().min(10).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g).required(),
        email: yup.string().email().required(),
    });

    userSchema.validateSync(data);
}

function loginValidation (data) {
    const userSchema = yup.object().shape({
        password: yup.string().min(10).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g).required(),
        email: yup.string().email().required(),
    });

    userSchema.validateSync(data);
}

function authValidation () {
    return (req, res, next) => {
        try {
            const bearerHeader = req.headers['authorization'];
            if (typeof bearerHeader !== 'undefined') {
                const bearer = bearerHeader.split(' ');
                const bearerToken = bearer[1];
                req.token = bearerToken;
                next();
            } else {
                res.sendStatus(403).json({
                    status: 'error',
                    message: 'access denied'
                });
            }
        } catch (err) {
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