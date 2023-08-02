const jwt = require('jsonwebtoken');
const {TOKEN_SECRET} = require('../config');
const {ErrorHelper} = require('../helper');

verifyToken = (req, res, next)=> {
    console.log('SESSION --> ', req.session);
    if(!req.session || !req.session.token){
        req.session.destroy((error)=>{
            error ? res.status(500).send(`El token no existe, y no se puede destruir la sesión --> ${error}`) : res.status(403).send('El token no existe');
        })
    }
    const token = req.session.token;
    console.log('Token validar --> ', token);
    
    jwt.verify(token, TOKEN_SECRET, function(err, decodedToken){
        if(err){
            req.session.destroy((error)=>{
                error ? res.status(500).send(`El token no es valido, y no se puede destruir la sesión --> ${error}`) : res.status(403).send('El token no es valido');
            })
        }

        req.user = decodedToken.user;
        next();
    });
}

deleteCookieSesion = (req, res, next)=>{
    try {
        req.session.destroy((error)=>{
            error ? res.status(500).send('Error al cerrar sesión') : next();
        })
    } catch (error) {
        throw ErrorHelper.generateError(error, 401);
    }
}

const authMiddleware = {
    verifyToken,
    deleteCookieSesion
}

module.exports = authMiddleware;