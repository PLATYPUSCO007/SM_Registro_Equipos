let _detalleMantService = null;
let _bdService = null;
let _mantenimientoService = null;
let _pool = null;
let sql = null;

class MantenimientoController {

    #data = '';

    constructor({ BDService, MantenimientoService, DetalleMantService}) {
        _bdService = BDService;
        _mantenimientoService = MantenimientoService;
        _detalleMantService = DetalleMantService;
        sql = _bdService.getMSSQL();
        this.query = '';
    }

    get dataInfo(){
        return this.#data;
    }

    set dataInfo(value){
        this.#data = value;
    }

    async createMantenimiento(req, res){

        let {tipo, fecha_mantenimiento, id_tecnico, observaciones, id_activo_fijo, actividades} = req.body;

        fecha_mantenimiento = new Date(fecha_mantenimiento);

        let mantenimiento = {
            fecha_mantenimiento,
            id_activo_fijo,
            id_tecnico,
            observaciones,
            tipo
        }

        let objectMantenimiento = await _mantenimientoService.create(mantenimiento);

        if (objectMantenimiento.message) {
            res.status(405).send('Error del cliente, Datos no validos');
            return;
        }

        this.query = `INSERT INTO [dbo].[mantenimiento] 
            (fecha_mantenimiento,id_activo_fijo,id_tecnico,observaciones,tipo)
            OUTPUT INSERTED.id_mantenimiento
            VALUES (@fecha_mantenimiento,@id_activo_fijo,@id_tecnico,@observaciones,@tipo)`;

        await _mantenimientoService.queryByObject(objectMantenimiento, this.query)
            .then(async (result) => {

                if (tipo.toUpperCase() == 'PREVENTIVO'){
                    if (!actividades) {
                        res.status(200).send({objectMantenimiento, Actividades: `Error del cliente, no hay actividades`});
                        return true;
                    }

                    this.query = `INSERT INTO [dbo].[detalle_mantenimiento] 
                        (id_mantenimiento, id_actividad) 
                        VALUES (@id_mantenimiento, @id_actividad)`;

                    await _detalleMantService.queryByDetalleMant({id_mantenimiento: result[0].id_mantenimiento, actividades}, this.query)
                        .then(result=>{
                            res.status(200).send({objectMantenimiento, Actividades: `${result}`});
                            return true;
                        })
                        .catch(error=>{
                            res.status(200).send({objectMantenimiento, Actividades: `${error}`});
                            return true;
                        });
                    
                }else{
                    res.status(200).send({objectMantenimiento});
                }
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

    async updateMantenimiento(req, res){

        let {id, tipo, fecha_mantenimiento, id_tecnico, observaciones, id_activo_fijo, actividades, id_detalles} = req.body;
        fecha_mantenimiento = new Date(fecha_mantenimiento);
        let mantenimiento = {
            fecha_mantenimiento,
            id_activo_fijo,
            id_tecnico,
            observaciones,
            tipo
        }
        let objectMantenimiento = await _mantenimientoService.create(mantenimiento);

        if (objectMantenimiento.message) {
            res.status(405).send('Error del cliente, Datos no validos');
            return;
        }

        objectMantenimiento.id = id;

        this.query = `UPDATE [dbo].[mantenimiento] SET fecha_mantenimiento = @fecha_mantenimiento,
            id_activo_fijo = @id_activo_fijo,
            id_tecnico = @id_tecnico,
            observaciones = @observaciones,
            tipo = @tipo 
            WHERE id_mantenimiento = @id`;

        await _mantenimientoService.queryByObject(objectMantenimiento, this.query)
            .then(async (result)=>{
                
                if (tipo.toUpperCase() == 'PREVENTIVO'){
                    
                    if ((!actividades) || (!id_detalles)) {
                        res.status(200).send({objectMantenimiento, Actividades: `No hay actividades`});
                        return;
                    }

                    this.query = `UPDATE[dbo].[detalle_mantenimiento] 
                        SET id_actividad = @id_actividad 
                        WHERE id_detalle_mant=@id`;

                    await _detalleMantService.queryByDetalleMant({id_mantenimiento: id, actividades, id: id_detalles}, this.query)
                        .then(result=>{
                            res.status(200).send({objectMantenimiento, Actividades: `${result}`});
                            return true;
                        })
                        .catch(error=>{
                            res.status(200).send({objectMantenimiento, Actividades: `${error}`});
                            return true;
                        });
                }else{
                    res.status(200).json(objectMantenimiento);
                }
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

    async deleteMantenimiento(req, res){

        if (!req.params.id) {
            res.status(405).send('Error del cliente, Id no enviado');
            return;
        }
        let {id} = req.params;

        this.query = `DELETE FROM [dbo].[mantenimiento] WHERE id_mantenimiento = @id`;

        await _mantenimientoService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la peticion');
            });
    }

    async getMantenimientoByID(req, res){

        if (!req.params.id) {
            res.status(405).send('Error del cliente, Id no enviado');
            return;
        }
        
        let {id} = req.params;

        this.query = `SELECT M.id_mantenimiento, M.tipo, M.fecha_mantenimiento, M.observaciones, M.id_activo_fijo, T.nombre,
            STUFF(
                (SELECT ', ' + CAST(D.id_detalle_mant AS VARCHAR(10)) FROM [dbo].[detalle_mantenimiento] D 
                RIGHT JOIN [dbo].[mantenimiento] M ON  D.id_mantenimiento = M.id_mantenimiento
                WHERE D.id_mantenimiento = @id
                FOR XML PATH('')),
                1, 2, '') AS Detalle_Mant,
            STUFF(
                (SELECT ', ' + A.nombre FROM [dbo].[actividades] A 
                RIGHT JOIN [dbo].[detalle_mantenimiento] D ON A.id_actividad = D.id_actividad
                WHERE D.id_mantenimiento = @id
                FOR XML PATH('')),
                1, 2, '') AS Actividades
            FROM [dbo].[mantenimiento] M LEFT JOIN [dbo].[tecnicos] T ON M.id_tecnico = T.id_tecnico WHERE M.id_mantenimiento = @id`
        
        await _mantenimientoService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la peticion');
            });
    }

    async getAllMantenimientos(req, res){

        this.query = `SELECT M.id_mantenimiento, M.tipo, M.fecha_mantenimiento, M.observaciones, M.id_activo_fijo, T.nombre,
            STUFF(
                (SELECT ', ' + CAST(D.id_detalle_mant AS VARCHAR(10)) FROM [dbo].[detalle_mantenimiento] D 
                WHERE D.id_mantenimiento = M.id_mantenimiento
                FOR XML PATH('')),
                1, 2, '') AS Detalle_Mant,
            STUFF(
                (SELECT ', ' + A.nombre FROM [dbo].[actividades] A 
                RIGHT JOIN [dbo].[detalle_mantenimiento] D ON A.id_actividad = D.id_actividad
                WHERE D.id_mantenimiento = M.id_mantenimiento
                FOR XML PATH('')),
                1, 2, '') AS Actividad
            FROM [dbo].[mantenimiento] M LEFT JOIN [dbo].[tecnicos] T ON M.id_tecnico = T.id_tecnico`;

        await _mantenimientoService.execute(this.query)
            .then(result=>{
                res.status(200).json(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la peticion');
            });
    }

    async getMantenimientoByEquipo(req, res){

            if (!req.params.id) {
                res.status(405).send('Error del cliente, Id no enviado');
                return;
            }

            let {id} = req.params;

            this.query = `SELECT M.id_mantenimiento, M.tipo, M.fecha_mantenimiento, M.observaciones, M.id_activo_fijo, T.nombre,
                STUFF(
                    (SELECT ', ' + CAST(D.id_detalle_mant AS VARCHAR(10)) FROM [dbo].[detalle_mantenimiento] D
                    WHERE D.id_mantenimiento = M.id_mantenimiento
                    AND
                    M.id_activo_fijo = @id
                    FOR XML PATH('')),
                    1, 2, '') AS Detalle_Mant,
                STUFF(
                    (SELECT ', ' + A.nombre FROM [dbo].[actividades] A 
                    RIGHT JOIN [dbo].[detalle_mantenimiento] D ON A.id_actividad = D.id_actividad
                    WHERE D.id_mantenimiento = M.id_mantenimiento
                    AND
                    M.id_activo_fijo = @id
                    FOR XML PATH('')),
                    1, 2, '') AS Actividad
                FROM [dbo].[mantenimiento] M LEFT JOIN [dbo].[tecnicos] T ON M.id_tecnico = T.id_tecnico
                WHERE M.id_activo_fijo = @id`;

            await _mantenimientoService.queryById(id, this.query)
                .then(result=>{
                    res.status(200).json(result);
                })
                .catch(error=>{
                    console.dir(error);
                    res.status(500).send('Error en la peticion');
                });
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