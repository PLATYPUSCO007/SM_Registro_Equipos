const {JWTHelper} = require('../helper');
let _adService = {};

class AuthService{
    constructor({ADService}){
        _adService = ADService;
    }

    async signIn(user){
        const userToEncode = {
            username: user.displayName,
            id: user.employeeID
        }

        const token = JWTHelper.generateToken(userToEncode);

        return {
            token,
            user: userToEncode
        }
    }
}

module.exports = AuthService;