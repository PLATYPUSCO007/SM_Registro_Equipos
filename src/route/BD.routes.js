const { Router } = require('express');

module.exports = function ({ PerifericoRoutes, EquipoRoutes, AsignacionRoutes, MantenimientoRoutes }) {
    const router = Router();

    router.use('/periferico', PerifericoRoutes);
    router.use('/equipo', EquipoRoutes);
    router.use('/asignacion', AsignacionRoutes);
    router.use('/mantenimiento', MantenimientoRoutes);

    router.get('/', function(req, res){
        res.status(200).send('BD LOAD...');
    });

    return router;
};