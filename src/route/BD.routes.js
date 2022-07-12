const { Router } = require('express');

module.exports = function ({ PerifericoRoutes, EquipoRoutes, AsignacionRoutes, MantenimientoRoutes, FileRoutes, SistemaOperativoRoutes }) {
    const router = Router();

    router.use('/periferico', PerifericoRoutes);
    router.use('/equipo', EquipoRoutes);
    router.use('/asignacion', AsignacionRoutes);
    router.use('/mantenimiento', MantenimientoRoutes);
    router.use('/factura', FileRoutes);
    router.use('/so', SistemaOperativoRoutes);

    router.get('/', function(req, res){
        res.status(200).send('BD LOAD...');
    });

    return router;
};