const { Router } = require('express');
const {AuthMiddleware} = require('../middleware');

module.exports = function ({ AuthController }) {
    const router = Router();

    router.post('/', AuthController.signIn);
    router.post('/logout', AuthMiddleware.deleteCookieSesion, AuthController.logOut);

    return router;
};