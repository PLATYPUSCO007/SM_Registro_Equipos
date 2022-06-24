const { Router } = require('express');
const { FileMiddleware, DataValidateMiddleware } = require('../middleware');

module.exports = function ({ EquipoController }) {
    const router = Router();

    router.post('/insert', [FileMiddleware, DataValidateMiddleware], EquipoController.createEquipo);
    router.get('/:id', EquipoController.getEquipo);
    router.get('/', EquipoController.getAllEquipos);
    router.delete('/delete/:id', EquipoController.deleteEquipo);
    router.patch('/update', DataValidateMiddleware, EquipoController.updateEquipo);

    return router; 
};