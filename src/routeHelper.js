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

module.exports = routeHelper;