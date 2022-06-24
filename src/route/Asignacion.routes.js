const { Router } = require('express');
const {DataValidateMiddleware} = require('../middleware');

module.exports = function ({ AsignacionController }) {
    const router = Router();

    router.get('/', AsignacionController.getAllAsignacion);
    router.get('/:id', AsignacionController.getAsignacion);
    router.post('/insert', DataValidateMiddleware, AsignacionController.createAsignacion);
    router.patch('/update', DataValidateMiddleware, AsignacionController.updateAsignacion);
    router.delete('/delete/:id', AsignacionController.deleteAsignacion);

    return router; 
};