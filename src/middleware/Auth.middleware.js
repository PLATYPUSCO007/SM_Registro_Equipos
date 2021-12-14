const jwt = require('jsonwebtoken');
const {TOKEN_SECRET} = require('../config');
const {ErrorHelper} = require('../helper');

module.exports = function (req, res, next) {
    const token = req.headers['authorization'];
    if(!token){
        throw ErrorHelper.generateError('Token must be sent', 400);
    }

    jwt.verify(token, TOKEN_SECRET, function(err, decodedToken){
        if(err){
            throw ErrorHelper.generateError('Invalid Token', 401);
        }

        req.user = decodedToken.user;
        next();
    });
}