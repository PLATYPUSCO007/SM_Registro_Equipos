const { Router } = require('express');
const {DataValidateMiddleware} = require('../middleware');

module.exports = function ({ FabricanteController }) {
    const router = Router();

    router.get('/', FabricanteController.getAll);
    router.get('/:id', FabricanteController.getById);
    router.get('/nit/:id', FabricanteController.getByNit);
    router.post('/insert', DataValidateMiddleware, FabricanteController.insert);
    router.delete('/delete/:id', FabricanteController.delete);
    router.patch('/update', DataValidateMiddleware, FabricanteController.update);
    

    return router;
};