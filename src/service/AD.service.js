const { ErrorHelper } = require("../helper");
const BaseService = require("./Base.service");
let config_ad = {};
let _ad = null;

let userNew = null;

class ADService extends BaseService {
  constructor({ config, AdRepository }) {
    super(AdRepository);
    this._adService = AdRepository;
    userNew = null;
  }

  validateUser(user, pass) {
    return new Promise(async (resolve, reject)=>{
      try {
        let result = await this._adService.validateUser(user, pass);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    })
  }
  
}

module.exports = ADService;
