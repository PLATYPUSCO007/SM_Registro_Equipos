const { Router } = require('express');
const {DataValidateMiddleware} = require('../middleware');

module.exports = function ({ MantenimientoController }) {
    const router = Router();

    router.post('/insert', [DataValidateMiddleware], MantenimientoController.createMantenimiento); 
    router.patch('/update', [DataValidateMiddleware], MantenimientoController.updateMantenimiento);
    router.delete('/delete/:id', MantenimientoController.deleteMantenimiento);
    router.get('/:id', MantenimientoController.getMantenimientoByID);
    router.get('/equipo/:id', MantenimientoController.getMantenimientoByEquipo);
    router.get('/', MantenimientoController.getAllMantenimientos);
    router.get('/all/preventivos', MantenimientoController.getMantenimientosPreventivos);
    router.get('/all/correctivos', MantenimientoController.getMantenimientosCorrectivos);
    router.get('/all/tecnico/:id', MantenimientoController.getMantenimientoByTecnico);
    router.get('/all/fecha/:fecha_in/:fecha_fin', MantenimientoController.getMantenimientoByFechas);

    return router;  
};