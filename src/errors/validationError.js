//clase de error de validacion para encapsular errores no internos o de validacion de datos de entrada

class ValidationError extends Error {
    constructor (error) {
        super(error.message);
        this.name = 'ValidationError';
        this.status = 403;
        this.path = error.path;
    }

    toJSON () {
        return {
            name: this.name,
            status: this.status,
            message: this.message,
            path: this.path,
        }
    }

}

module.exports = ValidationError;