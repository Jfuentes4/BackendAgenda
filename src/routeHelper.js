const jwt = require('jsonwebtoken');
var jwtKey = "passphrase";

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