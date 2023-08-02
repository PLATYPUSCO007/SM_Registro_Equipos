const active_directoy = require("activedirectory");
const BaseRepository = require('./base.repository');
const { ErrorHelper } = require("../helper");

let _user = null;
let config_ad = {};
let _ad = null;

class AdRepository extends BaseRepository{
    constructor({config, User}){
        super(User, '', 'ActiveDirectory');
        _user = User;
        config_ad = {
            url: config.LDAP,
            baseDN: config.DN,
            group: config.GROUPNAME,
            userAD: config.USER_AD,
            passAD: config.PASS_AD
          };
    }

    connectAD() {
        let config_test = {
          url: config_ad.url,
          baseDN: config_ad.baseDN,
          bindDN: config_ad.userAD,
          bindCredentials: config_ad.passAD,
        };
        return new Promise((resolve, reject)=>{
          _ad = new active_directoy(config_test);
  
          if (!_ad) {
            reject(ErrorHelper.generateError(
              "Error al iniciar el servicio AD",
              401
            ));
            return;
          }
  
          resolve(true);
          return;
        })
    }

    validateUser(user, pass){
        return new Promise(async (resolve, reject)=>{
            try {
                await this.connectAD();
                _ad.authenticate(user, pass, function (error, auth) {
                    if (!auth) {
                        reject(ErrorHelper.generateError(error || 'Error en la autenticacion', 500));
                        return; 
                    }

                    _ad.isUserMemberOf(user, config_ad.group, function(error, isMember) {
                        if (!isMember) {
                            reject(ErrorHelper.generateError(error || 'El usuario no es administrador', 500));
                            return;
                        }
        
                        _ad.findUser(user, function(error, userFind) {
                            if (!userFind) {
                                reject(ErrorHelper.generateError(error || 'El usuario no se encontro en el AD', 500));
                                return;
                            }
        
                            resolve(userFind);
                            return;
                        })
        
                    })
                })
            } catch (error) {
                reject(ErrorHelper.generateError(error, 500));
                return;
            }
        });
    }



}

module.exports = AdRepository; 