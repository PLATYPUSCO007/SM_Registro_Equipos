const {ErrorHelper} = require('../helper');
const BaseService = require('./Base.service');
let config_ad = {};
let _ad = null;
let _adService = null;
const active_directoy = require('activedirectory');
let userNew = null;

class ADService extends BaseService{

    constructor({ config, AdRepository }) {
        super(AdRepository);
        _adService = AdRepository;
        config_ad = {
            url: config.LDAP,
            baseDN: config.DN,
            group: config.GROUPNAME
        }
        userNew = null;
    }

    async connectAD(user, pass) {
        try {

            let config_test = {
                url: config_ad.url,
                baseDN: config_ad.baseDN,
                bindDN: user,
                bindCredentials: pass
            }

            _ad = new active_directoy(config_test);

            if (!_ad) {
                throw ErrorHelper.generateError('Error al iniciar el servicio AD', 301);
            }
            
        } catch (error) {
            throw ErrorHelper.generateError(error.message, 401);
        }

        return true;
    }

    async authenticateAD(user, pass){
        try {
            _ad.authenticate(user, pass, async function name(error, auth) {

                try {
                    if (error) {
                        throw ErrorHelper.generateError(error.message, 301);
                    }    

                    if (auth) {
                       _ad.isUserMemberOf(user, config_ad.group, async function(error, isMemeber) {

                            try{

                                if (error) {
                                    throw ErrorHelper.generateError(error.message, 301);
                                }

                                if (isMemeber) {
                                
                                     _ad.findUser(user, async function(error, user) {
                                         try {
                                             if (error) {
                                                 throw ErrorHelper.generateError(error.message, 301);
                                             }
                                         
                                             let {sn, displayName} = user;
                                             let userFind = {
                                                 sn,
                                                 displayName
                                             }
                                         
                                             _adService.create(userFind).then(user=>{
                                                userNew = user;
                                                console.log(JSON.stringify(userNew));
                                             });   
                                         
                                         } catch (error) {
                                             throw ErrorHelper.generateError(error.message, 301);
                                         }
                                     
                                     });
                                 
                                }
                            } catch (error) {
                                throw ErrorHelper.generateError(error.message, 301);
                            }
                       });
                    }

                    return null;

                } catch (error) {
                    throw ErrorHelper.generateError(error.message, 301);
                }

            });
        } catch (error) {
            throw ErrorHelper.generateError(error.message, 301);
        }
        return true;
    }

    async getUser(){
        return await _adService.getUser();
    }

}

module.exports = ADService;