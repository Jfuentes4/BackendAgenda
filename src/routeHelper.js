const jwt = require('jsonwebtoken');
var jwtKey = "passphrase";

//Helper para ayudar con la gestion de errores asyncronos
function routeHelper(callback) {
    return async (req, res) => {
        try {
            await callback(req, res);
        } catch (err) {
            res.status(400).json({
                status: 'error',
                message: err.message,
            })
        }
    }
    
}

//Helper para ayudar con la autentificación
function authHelper (callback) {
    return async (req, res) => {
        jwt.verify(req.token, jwtKey, async (err, data) => {
        console.log(data)

        if (err) {
            res.status(403);
        } else {
            console.log(data)
            req.authData = data;
            await callback(req, res);
        }
        }) 
    }
}


module.exports = {
    routeHelper,
    authHelper
};