const { Router } = require('express');

module.exports = function ({ ADController }) {
    const router = Router();

    router.get('/', ADController.authAD);
    router.get('/user', ADController.getUser);

    return router;
};