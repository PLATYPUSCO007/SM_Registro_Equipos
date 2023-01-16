let _adService = {};
let _authService = {};
const {ErrorHelper} = require("../helper");

class AuthController {
  constructor({ AuthService }) {
    _authService = AuthService;
  }

   async signIn(req, res) {
    let user = req.body.user;  //"william.enciso@servimeterssa.com";
    let pass = req.body.pass; //"We12345678*";
    try {

      let auth = await _authService.signIn(user, pass);

      return res.status(200).json({
        message: "Autenticado Satisfactoriamente",
        auth,
      });
      
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
}

module.exports = AuthController;
