let _bdService = null;
let _asignacionService = null;
let _pool = null;
let sql = null;

class AsignacionController {

    constructor({ BDService, AsignacionService}) {
        _bdService = BDService;
        _asignacionService = AsignacionService;
        sql = _bdService.getMSSQL();
    }

    async createAsignacion(req, res){
        try {

            let data;

            if (req.body.fecha_asignacion == null || req.body.fecha_retiro == null || req.body.identificacion == null || req.body.id_activo_fijo == null || req.body.motivo_asignacion == null || req.body.motivo_retiro == null || req.body.nombre_asignado == null || req.body.regional == null || req.body.tipo_asignacion == null) {
                res.status(405).send('Error del cliente, faltan datos');
                return;
            }

            let {fecha_asignacion, fecha_retiro, identificacion, id_activo_fijo, motivo_asignacion, motivo_retiro, nombre_asignado, regional, tipo_asignacion} = req.body;
            
            fecha_asignacion = new Date(fecha_asignacion);
            fecha_retiro = new Date(fecha_retiro);
            
            let asignacion = {
                fecha_asignacion,
                fecha_retiro,
                identificacion,
                id_activo_fijo,
                motivo_asignacion,
                motivo_retiro,
                nombre_asignado,
                regional,
                tipo_asignacion
            };

            let objectAsignacion = await _asignacionService.create(asignacion);

            if (objectAsignacion.message) {
                res.status(400).send('Error en el servidor ' + objectAsignacion.message);
                return;
            }

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {

                        data = await pool.request()
                        .input('fecha_asignacion', sql.DateTime, objectAsignacion.fecha_asignacion)
                        .input('fecha_retiro', sql.DateTime, objectAsignacion.fecha_retiro)
                        .input('identificacion', sql.NVarChar, objectAsignacion.identificacion)
                        .input('id_activo_fijo', sql.NVarChar, objectAsignacion.id_activo_fijo)
                        .input('motivo_asignacion', sql.NVarChar, objectAsignacion.motivo_asignacion)
                        .input('motivo_retiro', sql.NVarChar, objectAsignacion.motivo_retiro)
                        .input('nombre_asignado', sql.NVarChar, objectAsignacion.nombre_asignado)
                        .input('regional', sql.NVarChar, objectAsignacion.regional)
                        .input('tipo_asignacion', sql.NVarChar, objectAsignacion.tipo_asignacion)
                        .query('INSERT INTO [dbo].[asignacion] (fecha_asignacion, fecha_retiro, identificacion, id_activo_fijo, motivo_asignacion, motivo_retiro, nombre_asignado, regional, tipo_asignacion) VALUES (@fecha_asignacion, @fecha_retiro, @identificacion, @id_activo_fijo, @motivo_asignacion, @motivo_retiro, @nombre_asignado, @regional, @tipo_asignacion)');                        
                    } catch (error) {
                        console.log('No se pudo crear el registro. ', error.message);
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
            return;
        }

        return;
    }

    async updateAsignacion(req, res){
        try {

            let data;

            if (req.body.id == null || req.body.fecha_asignacion == null || req.body.fecha_retiro == null || req.body.identificacion == null || req.body.id_activo_fijo == null || req.body.motivo_asignacion == null || req.body.motivo_retiro == null || req.body.nombre_asignado == null || req.body.regional == null || req.body.tipo_asignacion == null) {
                res.status(405).send('Error del cliente, faltan datos');
                return;
            }

            let {id, fecha_asignacion, fecha_retiro, identificacion, id_activo_fijo, motivo_asignacion, motivo_retiro, nombre_asignado, regional, tipo_asignacion} = req.body;
            
            fecha_asignacion = new Date(fecha_asignacion);
            fecha_retiro = new Date(fecha_retiro);
            
            let asignacion = {
                fecha_asignacion,
                fecha_retiro,
                identificacion,
                id_activo_fijo,
                motivo_asignacion,
                motivo_retiro,
                nombre_asignado,
                regional,
                tipo_asignacion
            };

            let objectAsignacion = await _asignacionService.create(asignacion);

            if (objectAsignacion.message) {
                res.status(400).send('Error en el servidor ' + objectAsignacion.message);
                return;
            }

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {

                        data = await pool.request()
                        .input('id_asignacion', sql.Int, id)
                        .input('fecha_asignacion', sql.DateTime, objectAsignacion.fecha_asignacion)
                        .input('fecha_retiro', sql.DateTime, objectAsignacion.fecha_retiro)
                        .input('identificacion', sql.NVarChar, objectAsignacion.identificacion)
                        .input('id_activo_fijo', sql.NVarChar, objectAsignacion.id_activo_fijo)
                        .input('motivo_asignacion', sql.NVarChar, objectAsignacion.motivo_asignacion)
                        .input('motivo_retiro', sql.NVarChar, objectAsignacion.motivo_retiro)
                        .input('nombre_asignado', sql.NVarChar, objectAsignacion.nombre_asignado)
                        .input('regional', sql.NVarChar, objectAsignacion.regional)
                        .input('tipo_asignacion', sql.NVarChar, objectAsignacion.tipo_asignacion)
                        .query('UPDATE [dbo].[asignacion] SET fecha_asignacion = @fecha_asignacion, fecha_retiro = @fecha_retiro, identificacion = @identificacion, id_activo_fijo = @id_activo_fijo, motivo_asignacion = @motivo_asignacion, motivo_retiro = @motivo_retiro, nombre_asignado = @nombre_asignado, regional = @regional, tipo_asignacion = @tipo_asignacion WHERE id_asignacion = @id_asignacion');                        
                    } catch (error) {
                        console.log('No se pudo actualizar el registro. ', error.message);
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

    async getAllAsignacion(req, res){
        try {

            let data;

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {
                        data = await pool.request()
                        .query('SELECT * FROM [dbo].[asignacion]');                        
                    } catch (error) {
                        console.log('No se pudo obtener los registros. ', error.message);
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

    async getAsignacion(req, res){
        try {

            let data;

            if (req.params.id == null) {
                res.status(405).send('Error del cliente, Id no enviado');
                return;
            }

            let {id} = req.params;

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {

                        data = await pool.request()
                        .input('id_asignacion', sql.Int, id)
                        .query('SELECT * FROM [dbo].[asignacion] WHERE id_asignacion = @id_asignacion');                        
                    } catch (error) {
                        console.log('No se pudo obtener el registro. ', error.message);
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

    async deleteAsignacion(req, res){
        try {

            let data;

            if (req.params.id == null) {
                res.status(405).send('Error del cliente, Id no enviado');
                return;
            }

            let {id} = req.params;

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

module.exports = AsignacionController;