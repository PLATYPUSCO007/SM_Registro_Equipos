let _authService = {}

class AuthController{
    constructor({AuthService}){
        _authService = AuthService;
    }

    async signIn(req, res){
        const {body} = req;
        const userEncrypt = await _authService.signIn(body);
        return res.send(userEncrypt);
    }
}

module.exports = AuthController;