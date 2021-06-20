const yup = require('yup');
const validationError = require('../errors/validationError');

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
        name: yup.string().max(80).required(),
        date: yup.date().min(new Date(Date.now())).required(),
        description: yup.string().required(),
    });

    taskSchema.validateSync(data);
}

function userValidation (data) {
    const userSchema = yup.object().shape({
        name: yup.string().min(5).max(30).required(),
        password: yup.string().min(10).matches("^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$").required(),
        email: yup.string().email().required(),
    });

    userSchema.validateSync(data);
}

module.exports = {
    validate,
    userValidation,
    taskValidation,
}