let _bdService = null;
let _mantenimientoService = null;
let _pool = null;
let sql = null;

class MantenimientoController {

    constructor({ BDService, MantenimientoService}) {
        _bdService = BDService;
        _mantenimientoService = MantenimientoService;
        sql = _bdService.getMSSQL();
    }

    static async setActivities(req, res){
        try {
            
            let {actividades} = req.body;

            actividades = JSON.stringify(actividades);

            if (actividades.length < 0) {
                res.status(405).send('Error del cliente, no hay actividades');
                return;
            }

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {
                        data = await pool.request()
                        .query('SELECT MAX(id_mantenimiento) FROM [dbo].[mantenimiento]');                        
                    } catch (error) {
                        console.log('No se pudo completar la accion. ' + error.message);
                        return;
                    }
                })
                .catch(error=>{
                    console.log('Connect Database Failed ' + error.message);
                    return;
                })
                .finally(()=>{
                    _pool.close();
                    console.log(data);
                });

        } catch (error) {
            console.log('Error en el registro de actividades ' + error.message);
            return;
        }

        return;

    }

    async createMantenimiento(req, res){
        try {

            let data;

            if (req.body.tipo == null || req.body.fecha_mantenimiento == null || req.body.id_tecnico == null || req.body.id_activo_fijo == null) {
                if (req.body.tipo.toUpperCase() == 'PREVENTIVO' && req.body.actividades == null                                      ) {
                    res.status(405).send('Error del cliente, no hay actividades');
                    return;
                }
                res.status(405).send('Error del cliente, faltan datos');
                return;
            }

            let {tipo, fecha_mantenimiento, id_tecnico, observaciones, id_activo_fijo, actividades} = req.body;

            let mantenimiento = {
                fecha_mantenimiento,
                id_activo_fijo,
                id_tecnico,
                observaciones,
                tipo
            }

            let objectMantenimiento = await _mantenimientoService.create(mantenimiento);

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {
                        data = await pool.request()
                        .input('fecha_mantenimiento', sql.DateTime, objectMantenimiento.fecha_mantenimiento)
                        .input('id_activo_fijo', sql.DateTime, objectMantenimiento.id_activo_fijo)
                        .input('id_tecnico', sql.DateTime, objectMantenimiento.id_tecnico)
                        .input('observaciones', sql.DateTime, objectMantenimiento.observaciones)
                        .input('tipo', sql.DateTime, objectMantenimiento.tipo)
                        .query('INSERT INTO [dbo].[mantenimiento] (fecha_mantenimiento, id_activo_fijo, id_tecnico, observaciones, tipo) VALUES (@fecha_mantenimiento, @id_activo_fijo, @id_tecnico, @observaciones, @tipo)');                        
                        
                        if (req.body.actividades.toUpperCase() == 'PREVENTIVO'){
                            try {
                                MantenimientoController.setActivities(req, res);    
                            } catch (error) {
                                console.log('No se cargaron las actividades ' + error.message);
                            }
                        }
                    
                    } catch (error) {
                        console.log('No se pudo borrar el registro. ', error.message);
                        res.status(500).send(error);
                        return;
                    }
                })
                .catch(error=>{
                    console.log('Connect Database Failed', error.message);
                    res.status(500).send(error);
                    return;
                })
                .finally(()=>{
                    _pool.close();
                    res.status(200).json(data);
                });
            
        } catch (error) {
            console.log(error.message);
            res.status(500).send(error.message);
        }

        return;
    }

    async updateMantenimiento(req, res){
        try {

            let data;

            if (true) {
                res.status(405).send('Error del cliente, Id no enviado');
                return;
            }

            let {} = req;

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {

                        data = await pool.request()
                        .input('id_asignacion', sql.Int, id)
                        .query('DELETE FROM [dbo].[asignacion] WHERE id_asignacion = @id_asignacion');                        
                    } catch (error) {
                        console.log('No se pudo borrar el registro. ', error.message);
                        res.status(500).send(error);
                        return;
                    }
                })
                .catch(error=>{
                    console.log('Connect Database Failed', error.message);
                    res.status(500).send(error);
                    return;
                })
                .finally(()=>{
                    _pool.close();
                    res.status(200).json(data);
                });
            
        } catch (error) {
            console.log(error.message);
            res.status(500).send(error.message);
        }

        return;
    }
    async deleteMantenimiento(req, res){
        try {

            let data;

            if (true) {
                res.status(405).send('Error del cliente, Id no enviado');
                return;
            }

            let {} = req;

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {

                        data = await pool.request()
                        .input('id_asignacion', sql.Int, id)
                        .query('DELETE FROM [dbo].[asignacion] WHERE id_asignacion = @id_asignacion');                        
                    } catch (error) {
                        console.log('No se pudo borrar el registro. ', error.message);
                        res.status(500).send(error);
                        return;
                    }
                })
                .catch(error=>{
                    console.log('Connect Database Failed', error.message);
                    res.status(500).send(error);
                    return;
                })
                .finally(()=>{
                    _pool.close();
                    res.status(200).json(data);
                });
            
        } catch (error) {
            console.log(error.message);
            res.status(500).send(error.message);
        }

        return;
    }
    async getMantenimiento(req, res){
        try {

            let data;

            if (true) {
                res.status(405).send('Error del cliente, Id no enviado');
                return;
            }

            let {} = req;

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {

                        data = await pool.request()
                        .input('id_asignacion', sql.Int, id)
                        .query('DELETE FROM [dbo].[asignacion] WHERE id_asignacion = @id_asignacion');                        
                    } catch (error) {
                        console.log('No se pudo borrar el registro. ', error.message);
                        res.status(500).send(error);
                        return;
                    }
                })
                .catch(error=>{
                    console.log('Connect Database Failed', error.message);
                    res.status(500).send(error);
                    return;
                })
                .finally(()=>{
                    _pool.close();
                    res.status(200).json(data);
                });
            
        } catch (error) {
            console.log(error.message);
            res.status(500).send(error.message);
        }

        return;
    }
    async getAllMantenimientos(req, res){
        try {

            let data;

            if (true) {
                res.status(405).send('Error del cliente, Id no enviado');
                return;
            }

            let {} = req;

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {

                        data = await pool.request()
                        .input('id_asignacion', sql.Int, id)
                        .query('DELETE FROM [dbo].[asignacion] WHERE id_asignacion = @id_asignacion');                        
                    } catch (error) {
                        console.log('No se pudo borrar el registro. ', error.message);
                        res.status(500).send(error);
                        return;
                    }
                })
                .catch(error=>{
                    console.log('Connect Database Failed', error.message);
                    res.status(500).send(error);
                    return;
                })
                .finally(()=>{
                    _pool.close();
                    res.status(200).json(data);
                });
            
        } catch (error) {
            console.log(error.message);
            res.status(500).send(error.message);
        }

        return;
    }
    async getMantenimientoByEquipo(req, res){
        try {

            let data;

            if (true) {
                res.status(405).send('Error del cliente, Id no enviado');
                return;
            }

            let {} = req;

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {

                        data = await pool.request()
                        .input('id_asignacion', sql.Int, id)
                        .query('DELETE FROM [dbo].[asignacion] WHERE id_asignacion = @id_asignacion');                        
                    } catch (error) {
                        console.log('No se pudo borrar el registro. ', error.message);
                        res.status(500).send(error);
                        return;
                    }
                })
                .catch(error=>{
                    console.log('Connect Database Failed', error.message);
                    res.status(500).send(error);
                    return;
                })
                .finally(()=>{
                    _pool.close();
                    res.status(200).json(data);
                });
            
        } catch (error) {
            console.log(error.message);
            res.status(500).send(error.message);
        }

        return;
    }
    async getMantenimientosPreventivos(req, res){
        try {

            let data;

            if (true) {
                res.status(405).send('Error del cliente, Id no enviado');
                return;
            }

            let {} = req;

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {

                        data = await pool.request()
                        .input('id_asignacion', sql.Int, id)
                        .query('DELETE FROM [dbo].[asignacion] WHERE id_asignacion = @id_asignacion');                        
                    } catch (error) {
                        console.log('No se pudo borrar el registro. ', error.message);
                        res.status(500).send(error);
                        return;
                    }
                })
                .catch(error=>{
                    console.log('Connect Database Failed', error.message);
                    res.status(500).send(error);
                    return;
                })
                .finally(()=>{
                    _pool.close();
                    res.status(200).json(data);
                });
            
        } catch (error) {
            console.log(error.message);
            res.status(500).send(error.message);
        }

        return;
    }
    async getMantenimientosCorrectivos(req, res){
        try {

            let data;

            if (true) {
                res.status(405).send('Error del cliente, Id no enviado');
                return;
            }

            let {} = req;

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {

                        data = await pool.request()
                        .input('id_asignacion', sql.Int, id)
                        .query('DELETE FROM [dbo].[asignacion] WHERE id_asignacion = @id_asignacion');                        
                    } catch (error) {
                        console.log('No se pudo borrar el registro. ', error.message);
                        res.status(500).send(error);
                        return;
                    }
                })
                .catch(error=>{
                    console.log('Connect Database Failed', error.message);
                    res.status(500).send(error);
                    return;
                })
                .finally(()=>{
                    _pool.close();
                    res.status(200).json(data);
                });
            
        } catch (error) {
            console.log(error.message);
            res.status(500).send(error.message);
        }

        return;
    }
    async getMantenimientoByTecnicoOrFecha(req, res){
        try {

            let data;

            if (true) {
                res.status(405).send('Error del cliente, Id no enviado');
                return;
            }

            let {} = req;

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {

                        data = await pool.request()
                        .input('id_asignacion', sql.Int, id)
                        .query('DELETE FROM [dbo].[asignacion] WHERE id_asignacion = @id_asignacion');                        
                    } catch (error) {
                        console.log('No se pudo borrar el registro. ', error.message);
                        res.status(500).send(error);
                        return;
                    }
                })
                .catch(error=>{
                    console.log('Connect Database Failed', error.message);
                    res.status(500).send(error);
                    return;
                })
                .finally(()=>{
                    _pool.close();
                    res.status(200).json(data);
                });
            
        } catch (error) {
            console.log(error.message);
            res.status(500).send(error.message);
        }

        return;
    }

}

module.exports = MantenimientoController;