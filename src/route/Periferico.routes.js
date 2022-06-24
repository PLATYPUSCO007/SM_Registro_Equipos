const { Router } = require('express');
const {DataValidateMiddleware} = require('../middleware');

module.exports = function ({ PerifericoController }) {
    const router = Router();

    router.post('/insert', DataValidateMiddleware, PerifericoController.insertPeriferico);
    router.get('/', PerifericoController.getPerifericos);
    router.get('/:id', PerifericoController.getPerifericosById);
    router.get('/byequip/:id', PerifericoController.getPerifericosByIdEquipo);
    router.delete('/delete/:id', PerifericoController.deletePeriferico);
    router.patch('/update', DataValidateMiddleware, PerifericoController.updatePeriferico);
    

    return router;
};