const { Router } = require('express');

module.exports = function ({ AsignacionController }) {
    const router = Router();

    router.get('/', AsignacionController.getAllAsignacion);
    router.get('/:id', AsignacionController.getAsignacion);
    router.post('/insert', AsignacionController.createAsignacion);
    router.patch('/update', AsignacionController.updateAsignacion);
    router.delete('/delete/:id', AsignacionController.deleteAsignacion);

    return router; 
};