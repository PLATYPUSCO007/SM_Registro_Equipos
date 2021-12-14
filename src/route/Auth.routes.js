const { Router } = require('express');

module.exports = function ({ AuthController }) {
    const router = Router();

    router.get('/', AuthController.signIn);

    return router;
};