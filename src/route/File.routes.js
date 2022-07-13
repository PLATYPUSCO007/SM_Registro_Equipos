const { Router } = require('express');
const { FileMiddleware, DataValidateMiddleware } = require('../middleware');

module.exports = function ({ FileController }) {
    const router = Router();

    router.get('/:id/:tabla/:campo', FileController.getFiles);
    router.post('/insert', [FileMiddleware, DataValidateMiddleware], FileController.createFile);
    router.delete('/delete/:id/:tabla/:campo', FileController.deleteFile);

    return router; 
};