const { Router } = require('express');

module.exports = function ({ PerifericoController }) {
    const router = Router();

    router.get('/', PerifericoController.getPerifericos);
    router.get('/:id', PerifericoController.getPerifericosById);
    router.get('/byequip/:equipo', PerifericoController.getPerifericosByIdEquipo);
    router.post('/insert', PerifericoController.insertPeriferico);
    router.delete('/delete', PerifericoController.deletePeriferico);
    router.patch('/update', PerifericoController.updatePeriferico);
    

    return router;
};