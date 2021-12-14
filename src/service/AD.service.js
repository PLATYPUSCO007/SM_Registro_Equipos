const { ErrorHelper } = require("../helper");
const BaseService = require("./Base.service");
let config_ad = {};
let _ad = null;
let _adService = null;
const active_directoy = require("activedirectory");
let userNew = null;

class ADService extends BaseService {
  constructor({ config, AdRepository }) {
    super(AdRepository);
    _adService = AdRepository;
    config_ad = {
      url: config.LDAP,
      baseDN: config.DN,
      group: config.GROUPNAME,
    };
    userNew = null;
  }

  async connectAD(user, pass) {
    try {
      let config_test = {
        url: config_ad.url,
        baseDN: config_ad.baseDN,
        bindDN: user,
        bindCredentials: pass,
      };
      _ad = new active_directoy(config_test);
      if (!_ad) {
        return ErrorHelper.generateError(
          "Error al iniciar el servicio AD",
          401
        );
      } else {
        return _ad;
      }
    } catch (error) {
      return ErrorHelper.generateError(error.message, 401);
    }
  }

  async create(newUser){
    try {
      let user = await _adService.create(newUser);
      return user;
    } catch (error) {
      return ErrorHelper.generateError(error.messaage, 301);
    }
  }

  async getUser() {
    try {
      const user = await _adService.getUser();
      console.log("Usuario devuelto " + JSON.stringify(user));

      if (user != undefined) {
        return user;
      }

      return ErrorHelper.generateError("El usuario no Existe", 500);
    } catch (error) {
      return ErrorHelper.generateError(error.message, 301);
    }
  }
  
}

module.exports = ADService;
