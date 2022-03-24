const { Router } = require('express');

module.exports = function ({ AsignacionController }) {
    const router = Router();

    router.post('/insert', AsignacionController.createAsignacion);
    router.patch('/update', AsignacionController.updateAsignacion);
    router.delete('/delete/:id', AsignacionController.deleteAsignacion);
    router.get('/:id', AsignacionController.getAsignacion);
    router.get('/', AsignacionController.getAllAsignacion);

    return router; 
};