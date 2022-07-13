const { Router } = require('express');
const {DataValidateMiddleware} = require('../middleware');

module.exports = function ({ ModeloController }) {
    const router = Router();

    router.get('/', ModeloController.getAll);
    router.get('/:id', ModeloController.getById);
    router.get('/fabricante/:id', ModeloController.getByFabricante);
    router.post('/insert', DataValidateMiddleware, ModeloController.insert);
    router.delete('/delete/:id', ModeloController.delete);
    router.patch('/update', DataValidateMiddleware, ModeloController.update);
    

    return router;
};