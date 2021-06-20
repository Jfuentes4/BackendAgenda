const errorMiddleware = (error, req, res, next) => {
    //console.log("hubo un error")
    let errorObj;

    if (typeof error.toJSON === 'function') {
        errorObj = error.toJSON();
    } else {
        errorObj = {
            status: 'error',
            name: 'UnknownError',
            message: 'UnknownError',
        }
    }

    res.status(errorObj.status).json(errorObj);
}

module.exports = errorMiddleware