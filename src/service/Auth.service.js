const { JWTHelper } = require("../helper");
const { ErrorHelper } = require("../helper");
let _adService = {};

class AuthService {
  constructor({ ADService }) { 
    _adService = ADService;
  }

    signIn(user, pass) {
      return new Promise(async (resolve, reject)=>{
        try {
          let logUser = await _adService.validateUser(user, pass);
          let objectUser = await _adService.create({'sn': logUser.sn, 'displayName': logUser.displayName});
    
          if (objectUser.message) {
            reject(ErrorHelper.generateError('Error en el servidor', 400));
            return;
          }
          const token = await JWTHelper.generateToken(user);
          resolve({token, user});
          return; 
        } catch (error) {
          reject(ErrorHelper.generateError('No se logro generar el token', 400));
          return;
        }
      })
    }
}

module.exports = AuthService;
