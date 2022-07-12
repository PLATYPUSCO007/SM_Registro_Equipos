const { Router } = require('express');
const {DataValidateMiddleware} = require('../middleware');

module.exports = function ({ SistemaOperativoController }) {
    const router = Router();

    router.get('/', SistemaOperativoController.getAll);
    router.get('/:id', SistemaOperativoController.getById);
    router.post('/insert', DataValidateMiddleware, SistemaOperativoController.insert);
    router.delete('/delete/:id', SistemaOperativoController.delete);
    router.patch('/update', DataValidateMiddleware, SistemaOperativoController.update);
    

    return router;
};