const { Router } = require('express');

module.exports = function ({ PerifericoRoutes, EquipoRoutes }) {
    const router = Router();

    router.use('/periferico', PerifericoRoutes);
    router.use('/equipo', EquipoRoutes);

    router.get('/', function(req, res){
        res.status(200).send('BD LOAD...');
    });

    return router;
};