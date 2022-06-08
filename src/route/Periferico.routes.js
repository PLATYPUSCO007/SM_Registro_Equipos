const { Router } = require('express');

module.exports = function ({ PerifericoController }) {
    const router = Router();

    router.post('/insert', PerifericoController.insertPeriferico);
    router.get('/', PerifericoController.getPerifericos);
    router.get('/:id', PerifericoController.getPerifericosById);
    router.get('/byequip/:equipo', PerifericoController.getPerifericosByIdEquipo);
    router.delete('/delete/:id', PerifericoController.deletePeriferico);
    router.patch('/update', PerifericoController.updatePeriferico);
    

    return router;
};