const { Router } = require('express');
const {DataValidateMiddleware} = require('../middleware');

module.exports = function ({ ActividadController }) {
    const router = Router();

    router.get('/', ActividadController.getAll);
    router.get('/:id', ActividadController.getById);
    router.post('/insert', DataValidateMiddleware, ActividadController.insert);
    router.delete('/delete/:id', ActividadController.delete);
    router.patch('/update', DataValidateMiddleware, ActividadController.update);
    

    return router;
};