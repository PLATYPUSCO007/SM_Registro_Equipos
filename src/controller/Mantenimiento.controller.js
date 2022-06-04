let _bdService = null;
let _mantenimientoService = null;
let _pool = null;
let sql = null;

class MantenimientoController {

    #data = '';

    constructor({ BDService, MantenimientoService}) {
        _bdService = BDService;
        _mantenimientoService = MantenimientoService;
        sql = _bdService.getMSSQL();
    }

    get dataInfo(){
        return this.#data;
    }

    set dataInfo(value){
        this.#data = value;
    }

    static async setActivities(req, res){
        let data = '';
        let pool = '';
        let last_id = '';

        try { 
            
            let {actividades} = req.body;

            _pool = _bdService.createInstance();
            
            actividades.forEach(async (actividad, index) => {

                await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {
                        data = await pool.request()
                        .input('id_actividad', sql.Int, actividad)
                        .query('INSERT INTO [dbo].[detalle_mantenimiento] (id_mantenimiento, id_actividad) SELECT MAX(id_mantenimiento), @id_actividad FROM [dbo].[mantenimiento]')      

                    } catch (error) {
                        console.log('No se registraron las actividades. ', error.message);
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
                })
            });

        } catch (error) {
            console.log('Error en el registro de actividades ' + error.message);
            return error;
        } finally{
            res.status(200).send('Creado con Exito!');
        }

    }

    static async updateActivities(actividad, id_detalle){
        let data = '';
        let pool = '';
        let detalle = '';

        try { 

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {
                        data = await pool.request()
                        .input('id_actividad', sql.Int, actividad)
                        .input('id_detalle_mant', sql.Int, id_detalle)
                        .query('UPDATE[dbo].[detalle_mantenimiento] SET id_actividad = @id_actividad WHERE id_detalle_mant=@id_detalle_mant');
                        
                        return data;

                    } catch (error) {
                        console.log('No se registraron las actividades. ', error.message);
                        // res.status(500).send(error);
                        return;
                    }
                })
                .catch(error=>{
                    console.log('Connect Database Failed', error.message);
                    // res.status(500).send(error);
                    return;
                })
                .finally(()=>{
                    _pool.close();
                })
            

        } catch (error) {
            console.log('Error en el registro de actividades ' + error.message);
            return error;
        }
    }

    async createMantenimiento(req, res){
        try {

            let data;

            if (req.body.tipo == null || req.body.fecha_mantenimiento == null || req.body.id_tecnico == null || req.body.id_activo_fijo == null) {
                res.status(405).send('Error del cliente, faltan datos');
                return;
            }

            let {tipo, fecha_mantenimiento, id_tecnico, observaciones, id_activo_fijo, actividades} = req.body;

            if ((tipo.toUpperCase() == 'PREVENTIVO') && (!actividades)) {
                res.status(405).send('Error del cliente, no hay actividades');
                return;
            }

            fecha_mantenimiento = new Date(fecha_mantenimiento);

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
                        .input('id_activo_fijo', sql.NVarChar, objectMantenimiento.id_activo_fijo)
                        .input('id_tecnico', sql.Int, objectMantenimiento.id_tecnico)
                        .input('observaciones', sql.NVarChar, objectMantenimiento.observaciones)
                        .input('tipo', sql.NVarChar, objectMantenimiento.tipo)
                        .query('INSERT INTO [dbo].[mantenimiento] (fecha_mantenimiento,id_activo_fijo,id_tecnico,observaciones,tipo) VALUES (@fecha_mantenimiento,@id_activo_fijo,@id_tecnico,@observaciones,@tipo)')                        
                        .then(result => {
                            
                            if (tipo.toUpperCase() == 'PREVENTIVO'){
                                try {
                                    _pool.close(); 
                                    MantenimientoController.setActivities(req, res);
                                } catch (error) {
                                    console.log('No se cargaron las actividades ' + error.message);
                                }
                            }else{
                                res.status(200).json(data);
                                _pool.close();
                            }
                        });
                    
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
            let {id} = req.body;

            if (!id) {
                res.status(405).send('Error del cliente, Id no enviado');
                return;
            }

            let {tipo, fecha_mantenimiento, id_tecnico, observaciones, id_activo_fijo, actividades, id_detalles} = req.body;

            if ((tipo.toUpperCase() == 'PREVENTIVO') && (!actividades)) {
                res.status(405).send('Error del cliente, no hay actividades');
                return;
            }

            fecha_mantenimiento = new Date(fecha_mantenimiento);

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
                        .input('id_mantenimiento', sql.Int, id)
                        .input('fecha_mantenimiento', sql.DateTime, objectMantenimiento.fecha_mantenimiento)
                        .input('id_activo_fijo', sql.NVarChar, objectMantenimiento.id_activo_fijo)
                        .input('id_tecnico', sql.Int, objectMantenimiento.id_tecnico)
                        .input('observaciones', sql.NVarChar, objectMantenimiento.observaciones)
                        .input('tipo', sql.NVarChar, objectMantenimiento.tipo)
                        .query(`UPDATE [dbo].[mantenimiento] SET fecha_mantenimiento = @fecha_mantenimiento,
                                id_activo_fijo = @id_activo_fijo,
                                id_tecnico = @id_tecnico,
                                observaciones = @observaciones,
                                tipo = @tipo 
                                WHERE id_mantenimiento = @id_mantenimiento`)
                        .then(result => {
                            if (tipo.toUpperCase() == 'PREVENTIVO'){
                                    _pool.close(); 
                                    for (let i = 0; i < actividades.length; i++) {
                                        try {
                                            MantenimientoController.updateActivities(actividades[i], id_detalles[i]);
                                        } catch (error) {
                                            console.log('No se cargaron las actividades ' + error.message);
                                            res.status(506).send(error);
                                        }    
                                    }
                                    res.status(200).send('Actualizado con Exito!');
                            }else{
                                res.status(200).send('Actualizado con Exito!');
                                _pool.close();
                            }
                        })
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
                });
            
        } catch (error) {
            console.log(error.message);
            res.status(500).send(error);
        }

        return;
    }

    async deleteMantenimiento(req, res){
        let data = '';
        
        try {

            let {id} = req.params;

            if (!id) {
                res.status(405).send('Error del cliente, Id no enviado');
                return;
            }

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {
                        data = await pool.request()
                        .input('id_mantenimiento', sql.Int, id)
                        .query('DELETE FROM [dbo].[detalle_mantenimiento] WHERE id_mantenimiento = @id_mantenimiento');                        
                    } catch (error) {
                        console.log('No se pudo borrar el registro. ', error.message);
                        res.status(500).send(error);
                        return true;
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
        }

        return;
    }

    async getMantenimientoByID(req, res){
        try {

            let data;

            let {id} = req.params;

            if (!id) {
                res.status(405).send('Error del cliente, Id no enviado');
                return;
            }

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {
                        data = await pool.request()
                        .input('id_mantenimiento', sql.Int, id)
                        .query(`SELECT M.id_mantenimiento, M.tipo, M.fecha_mantenimiento, M.observaciones, M.id_activo_fijo, T.nombre, D.id_detalle_mant, A.nombre AS actividad
                            FROM [dbo].[mantenimiento] M LEFT JOIN [dbo].[detalle_mantenimiento] D ON M.id_mantenimiento = D.id_mantenimiento
                            LEFT JOIN [dbo].[tecnicos] T ON M.id_tecnico = T.id_tecnico LEFT JOIN [dbo].[actividades] A ON D.id_actividad = A.id_actividad
                            WHERE M.id_mantenimiento = @id_mantenimiento`);                        
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
                    res.status(200).json(data.recordset);
                });
            
        } catch (error) {
            console.log(error.message);
        }

        return;
    }

    async getAllMantenimientos(req, res){
        try {

            let data;

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {

                        data = await pool.request()
                        .query(`SELECT M.id_mantenimiento, M.tipo, M.fecha_mantenimiento, M.observaciones, M.id_activo_fijo, T.nombre, D.id_detalle_mant, A.nombre AS actividad
                            FROM [dbo].[mantenimiento] M INNER JOIN [dbo].[detalle_mantenimiento] D ON M.id_mantenimiento = D.id_mantenimiento
                            INNER JOIN [dbo].[tecnicos] T ON M.id_tecnico = T.id_tecnico INNER JOIN [dbo].[actividades] A ON D.id_actividad = A.id_actividad`);                        
                    } catch (error) {
                        console.log('No obtuvieron los registros. ', error.message);
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
                    res.status(200).json(data.recordset);
                });
            
        } catch (error) {
            console.log(error.message);
        }

        return;
    }

    async getMantenimientoByEquipo(req, res){
        try {

            let data;

            let {id_equipo} = req.params;

            if (!id_equipo) {
                res.status(405).send('Error del cliente, Id no enviado');
                return;
            }

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {
                        data = await pool.request()
                        .input('id_activo_fijo', sql.NVarChar, id_equipo)
                        .query(`SELECT M.id_mantenimiento, M.tipo, M.fecha_mantenimiento, M.observaciones, M.id_activo_fijo, T.nombre, D.id_detalle_mant, A.nombre AS actividad
                            FROM [dbo].[mantenimiento] M LEFT JOIN [dbo].[detalle_mantenimiento] D ON M.id_mantenimiento = D.id_mantenimiento
                            LEFT JOIN [dbo].[tecnicos] T ON M.id_tecnico = T.id_tecnico LEFT JOIN [dbo].[actividades] A ON D.id_actividad = A.id_actividad
                            WHERE M.id_activo_fijo = @id_activo_fijo`);
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
                    res.status(200).json(data.recordset);
                });
            
        } catch (error) {
            console.log(error.message);
        }

        return;
    }

    async getMantenimientosPreventivos(req, res){
        try {

            let data;

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {

                        data = await pool.request()
                        .query(`SELECT M.id_mantenimiento, M.tipo, M.fecha_mantenimiento, M.observaciones, M.id_activo_fijo, T.nombre, D.id_detalle_mant, A.nombre AS actividad
                            FROM [dbo].[mantenimiento] M LEFT JOIN [dbo].[detalle_mantenimiento] D ON M.id_mantenimiento = D.id_mantenimiento
                            LEFT JOIN [dbo].[tecnicos] T ON M.id_tecnico = T.id_tecnico LEFT JOIN [dbo].[actividades] A ON D.id_actividad = A.id_actividad
                            WHERE M.tipo = 'Preventivo'`);                        
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
                    res.status(200).json(data.recordset);
                });
            
        } catch (error) {
            console.log(error.message);
        }

        return;
    }

    async getMantenimientosCorrectivos(req, res){
        try {

            let data;

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {

                        data = await pool.request()
                        .query(`SELECT M.id_mantenimiento, M.tipo, M.fecha_mantenimiento, M.observaciones, M.id_activo_fijo, T.nombre, D.id_detalle_mant, A.nombre AS actividad
                            FROM [dbo].[mantenimiento] M LEFT JOIN [dbo].[detalle_mantenimiento] D ON M.id_mantenimiento = D.id_mantenimiento
                            LEFT JOIN [dbo].[tecnicos] T ON M.id_tecnico = T.id_tecnico LEFT JOIN [dbo].[actividades] A ON D.id_actividad = A.id_actividad
                            WHERE M.tipo = 'Correctivo'`);                          
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
                    res.status(200).json(data.recordset);
                });
            
        } catch (error) {
            console.log(error.message);
        }

        return;
    }
    async getMantenimientoByTecnico(req, res){
        try {

            let data;

            let {id_tecnico} = req.params;

            if (!id_tecnico) {
                res.status(405).send('Error del cliente, no hay un id valido');
                return;
            }

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {

                        data = await pool.request()
                            .input('id_tecnico', sql.Int, id_tecnico)
                            .query(`SELECT M.id_mantenimiento, M.tipo, M.fecha_mantenimiento, M.observaciones, M.id_activo_fijo, T.nombre, D.id_detalle_mant, A.nombre AS actividad
                                FROM [dbo].[mantenimiento] M LEFT JOIN [dbo].[detalle_mantenimiento] D ON M.id_mantenimiento = D.id_mantenimiento
                                LEFT JOIN [dbo].[tecnicos] T ON M.id_tecnico = T.id_tecnico LEFT JOIN [dbo].[actividades] A ON D.id_actividad = A.id_actividad
                                WHERE M.id_tecnico = @id_tecnico`);                        
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
                    res.status(200).json(data.recordset);
                });
            
        } catch (error) {
            console.log(error.message);
        }

        return;
    }

    async getMantenimientoByFechas(req, res){
        var year, month, day;
        var fecha_inicio, fecha_final;
        try {

            let data;

            let {fecha_in, fecha_fin} = req.params;

            if (!fecha_in) {
                res.status(405).send('Error del cliente, no hay fecha de inicio');
                return;
            }

            const convertDate = (fecha)=>{
                var obj_fecha = {};
                fecha = new Date(fecha);
                obj_fecha.year = fecha.getFullYear();
                obj_fecha.month = (fecha.getMonth()+1);
                obj_fecha.day = fecha.getDate();
                return obj_fecha;
            }
        
            const fixDate = (val)=>{
                if (val <= 9) {
                    return '0'+val;
                }
                return val;
            }

            fecha_in = convertDate(fecha_in);
            fecha_in.month = fixDate(fecha_in.month);
            fecha_in.day = fixDate(fecha_in.day);

            fecha_inicio = fecha_in.year + '' + fecha_in.month + '' + fecha_in.day

            if (fecha_fin.length == 2) {
                fecha_fin = new Date();
                month = fixDate(fecha_fin.getMonth() + 1);
                day = fixDate(fecha_fin.getDate());
                fecha_final = fecha_fin.getFullYear() + '' + month + '' + day;
            }else{
                fecha_fin = convertDate(fecha_fin);
                fecha_fin.month = fixDate(fecha_fin.month);
                fecha_fin.day = fixDate(fecha_fin.day);
                fecha_final = fecha_fin.year + '' + fecha_fin.month + '' + fecha_fin.day;
            }

            console.log(fecha_inicio, fecha_final);

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectando a MSSQL');
                    try {

                        data = await pool.request()
                        .query(`SELECT M.id_mantenimiento, M.tipo, M.fecha_mantenimiento, M.observaciones, M.id_activo_fijo, T.nombre, D.id_detalle_mant, A.nombre AS actividad
                            FROM [dbo].[mantenimiento] M LEFT JOIN [dbo].[detalle_mantenimiento] D ON M.id_mantenimiento = D.id_mantenimiento
                            LEFT JOIN [dbo].[tecnicos] T ON M.id_tecnico = T.id_tecnico LEFT JOIN [dbo].[actividades] A ON D.id_actividad = A.id_actividad
                            WHERE M.fecha_mantenimiento >= '${fecha_inicio}' AND M.fecha_mantenimiento <= '${fecha_final}'`);                        
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
        }

        return;
    }

}

module.exports = MantenimientoController;