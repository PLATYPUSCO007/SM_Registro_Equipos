const { Router } = require('express');
const {DataValidateMiddleware} = require('../middleware');

module.exports = function ({ TecnicoController }) {
    const router = Router();

    router.get('/', TecnicoController.getAll);
    router.get('/:id', TecnicoController.getById);
    router.post('/insert', DataValidateMiddleware, TecnicoController.insert);
    router.delete('/delete/:id', TecnicoController.delete);
    router.patch('/update', DataValidateMiddleware, TecnicoController.update);
    

    return router;
};