const { Router } = require('express');
const { FileMiddleware, DataValidateMiddleware } = require('../middleware');

module.exports = function ({ FileController }) {
    const router = Router();

    router.get('/:id', FileController.getFiles);
    router.post('/insert', [FileMiddleware], FileController.createFile);
    router.delete('/delete/:id', FileController.deleteFile);

    return router; 
};