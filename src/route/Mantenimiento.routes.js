const { Router } = require('express');

module.exports = function ({ MantenimientoController }) {
    const router = Router();

    router.post('/insert', MantenimientoController.createMantenimiento);
    router.patch('/update', MantenimientoController.updateMantenimiento);
    router.delete('/delete/:id', MantenimientoController.deleteMantenimiento);
    router.get('/:id', MantenimientoController.getMantenimiento);
    router.get('/', MantenimientoController.getAllMantenimientos);

    return router; 
};