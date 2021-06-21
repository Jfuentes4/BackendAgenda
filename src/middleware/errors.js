const errorMiddleware = (error, req, res, next) => {
    //console.log("hubo un error")
    let errorObj;

    console.log(error.message);

    if (typeof error.toJSON === 'function') {
        errorObj = error.toJSON();
    } else {
        errorObj = {
            status: '500',
            name: 'UnknownError',
            message: 'UnknownError',
        }
    }

    res.status(errorObj.status).json(errorObj);
}

module.exports = errorMiddleware