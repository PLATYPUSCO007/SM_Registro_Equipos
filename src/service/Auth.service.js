const { JWTHelper } = require("../helper");
const { ErrorHelper } = require("../helper");
let _adService = {};

class AuthService {
  constructor({ ADService }) {
    _adService = ADService;
  }

    async signIn(user) {
      try {
        const token = await JWTHelper.generateToken(user);
        return {
            token,
            user
        } 
      } catch (error) {
        return ErrorHelper.generateError('No se logro generar el token', 400);
      }
    }
}

module.exports = AuthService;
