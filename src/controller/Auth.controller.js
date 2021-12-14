let _adService = {};
let _authService = {};
let config_ad = {};
const {ErrorHelper} = require("../helper");

class AuthController {
  constructor({ ADService, config, AuthService }) {
    _adService = ADService;
    _authService = AuthService;

    config_ad = {
      group: config.GROUPNAME,
    };
  }

  async signIn(req, res) {
    let user = req.body.user;  //"william.enciso@servimeterssa.com";
    let pass = req.body.pass; //"We12345678*";
    try {
      var ad = await _adService.connectAD(user, pass);

      ad.authenticate(user, pass, async function (err, auth) {
        if (auth) {
          ad.isUserMemberOf(user, config_ad.group, async function(error, isMemeber) {
            if(isMemeber){
              ad.findUser(user, async function(error, user) {
                let {sn, displayName} = user;

                let userFind = {
                    sn,
                    displayName
                }

                try {

                  let ObjectUser = await _adService.create(userFind);
                  let auth = await _authService.signIn(ObjectUser);

                  return res.status(200).json({
                    message: "Autenticado Satisfactoriamente",
                    user: JSON.stringify(auth),
                  });

                } catch (error) {
                  return ErrorHelper.generateError(error.message, 301);
                }

              });
            } else {
              console.log("ERROR: " + JSON.stringify(err));
              return res.status(500).send("No es un Administrador");
            }
          });
        } else {
          console.log("ERROR: " + JSON.stringify(err));
          return res.status(500).send("Error en la autenticacion");
        }
      });

    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
}

module.exports = AuthController;
