const { Router } = require('express');
const { FileMiddleware } = require('../middleware');

module.exports = function ({ EquipoController }) {
    const router = Router();

    router.post('/upfile', FileMiddleware, EquipoController.UploadFile);
    router.post('/insert', FileMiddleware, EquipoController.createEquipo);
    router.get('/files/:id', FileMiddleware, EquipoController.getFiles);
    router.delete('/file/delete/:id', EquipoController.deleteFile);

    return router; 
};