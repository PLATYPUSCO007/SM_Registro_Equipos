const jwt = require('jsonwebtoken');
const {TOKEN_SECRET} = require('../config');
const {ErrorHelper} = require('../helper');

verifyToken = (req, res, next)=> {
    const token = req.session.token;
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

deleteCookieSesion = (req, res, next)=>{
    try {
        req.session = null;
        next();
    } catch (error) {
        throw ErrorHelper.generateError(error, 401);
    }
}

const authMiddleware = {
    verifyToken,
    deleteCookieSesion
}

module.exports = authMiddleware;