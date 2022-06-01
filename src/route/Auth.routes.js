const { Router } = require('express');

module.exports = function ({ AuthController }) {
    const router = Router();

    router.post('/', AuthController.signIn);

    return router;
};