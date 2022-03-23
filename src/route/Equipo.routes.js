const { Router } = require('express');
const { FileMiddleware } = require('../middleware');

module.exports = function ({ EquipoController }) {
    const router = Router();

    router.post('/upfile', FileMiddleware, EquipoController.UploadFile);
    router.post('/insert', FileMiddleware, EquipoController.createEquipo);
    router.get('/files/:id', FileMiddleware, EquipoController.getFiles);
    router.get('/:id', EquipoController.getEquipo);
    router.get('/', EquipoController.getAllEquipos);
    router.delete('/file/delete/:id', EquipoController.deleteFile);
    router.delete('/delete/:id', EquipoController.deleteEquipo);
    router.patch('/update', EquipoController.updateEquipo);

    return router; 
};