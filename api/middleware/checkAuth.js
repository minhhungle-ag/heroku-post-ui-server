const jwt = require('jsonwebtoken')
const appConstants = require('../../constants/appConstants')

function checkAuth(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        const decoded = jwt.verify(token, appConstants.JWT_KEY)
        req.userData = decoded

        next()
    } catch (error) {
        console.log(error)

        res.status(200).json({
            message: error.message,
        })
    }
}

module.exports = checkAuth
