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

      req.session.token = auth.token;

      return res.status(200).json({
        message: "Autenticado Satisfactoriamente",
        user: auth.user,
      });
      
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }

  async logOut(req, res){
    res.status(200).send('Cerró sesión con exito!')
  }

}

module.exports = AuthController;
