const {ErrorHelper} = require('../helper');

module.exports = (req, res, next)=>{

    let object = {...req.body}

    for (const key in object) {
        const element = object[key];
        
        if (element == null) {
            throw ErrorHelper.generateError('User Error, check information and try again', 400); 
        }
    }
    
    next();
    
}