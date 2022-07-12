const { Router } = require('express');

module.exports = function ({ PerifericoRoutes, EquipoRoutes, AsignacionRoutes, MantenimientoRoutes, FileRoutes, SistemaOperativoRoutes, FabricanteRoutes, ActividadRoutes, TecnicoRoutes }) {
    const router = Router();

    router.use('/periferico', PerifericoRoutes);
    router.use('/equipo', EquipoRoutes);
    router.use('/asignacion', AsignacionRoutes);
    router.use('/mantenimiento', MantenimientoRoutes);
    router.use('/factura', FileRoutes);
    router.use('/so', SistemaOperativoRoutes);
    router.use('/fabricante', FabricanteRoutes);
    router.use('/actividad', ActividadRoutes);
    router.use('/tecnico', TecnicoRoutes);

    router.get('/', function(req, res){
        res.status(200).send('BD LOAD...');
    });

    return router;
};