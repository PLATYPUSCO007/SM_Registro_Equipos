const { Router } = require('express');

module.exports = function ({ BDController }) {
    const router = Router();

    router.get('/', BDController.getData);

    return router;
};