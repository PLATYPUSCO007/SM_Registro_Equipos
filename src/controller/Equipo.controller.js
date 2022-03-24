let _bdService = null;
let _equipoService = null;
let _pool = null;
let sql = null;
const fs = require('fs');
const fs_extra = require('fs-extra');
const path = require('path');


class EquipoController {

    constructor({ BDService, EquipoService}) {
        _bdService = BDService;
        _equipoService = EquipoService;
        sql = _bdService.getMSSQL();
    }

    // static file (fileName) {
    //     return new Promise((resolve, reject) => {
    //         if (!fileName) {
    //             reject(new Error('No hay nombre ' + fileName));
    //         }

    //         resolve(console.log(fileName));
    //     });
    // }

    static async upFiles(req, res){

            let data;

            if ((req.files.length == 0) || (req.body.id_activo_fijo == undefined)) {
                res.status(500).send(new Error('No hay valores'));
                return;
            }

            var files = req.files;
            var activo = req.body.id_activo_fijo;

            _pool = _bdService.createInstance();

            files.forEach(async (file, index) => {
                let type = file.mimetype;
                let name = file.originalname;

                let buff = fs.readFileSync(path.join(__dirname, '../files/' + file.filename));
                let base64data = buff.toString('base64');

                await _pool.connect()
                    .then(async (pool)=>{
                        console.log('Conectado a MSSQL');
                        try {
                             data = await pool.request()
                            .input('nombre_archivo', sql.NVarChar, name)
                            .input('tipo_archivo', sql.NVarChar, type)
                            .input('contenido_archivo', sql.VarBinary(sql.MAX), new Buffer(base64data))
                            .input('id_activo_fijo', sql.NVarChar, activo)
                            .query("INSERT INTO [dbo].[factura] (nombre_archivo,tipo_archivo,contenido_archivo,id_activo_fijo) VALUES (@nombre_archivo,@tipo_archivo,@contenido_archivo,@id_activo_fijo)")

                            fs.unlink(path.join(__dirname, '../files/' + file.filename), (error)=>{
                                if (error) {
                                    console.log('El archivo ' + file.filename + ' no se ha removido, remuevalo manualmente!');
                                }

                                console.log('El archivo '+ file.filename + ' se ha removido!');
                            });

                            // res.status(200).json(buff);
                        } catch (error) {
                            console.log('No se pudo guardar el registro. ', error.message);
                            res.status(500).send(error);
                            return;
                        }
                    })
                    .catch((error)=>{
                        console.log('Connect Database Failed', error.message);
                        res.status(500).send(error);
                        return;
                    })
                    .finally(()=>{
                        _pool.close();
                        res.status(200).json(data);
                    });
            });

            return;
    }

    async getFiles(req, res){
        try {

            if(!req.params.id){
                console.log('No hay parametros de busqueda');
                res.status(404).send('No hay parametro');
                return;
            }

            let {id} = req.params;

            try {
                fs_extra.emptyDirSync(path.join(__dirname, '../temp/'));  
                console.log('El directorio temporal se ha limpiado con exito!');
            } catch (error) {
                console.log('El directorio temporal no se ha limpiado!');
            }

            _pool = _bdService.createInstance();

            _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectado a MSSQL');
                    try {
                        const data = await pool.request()
                        .input('id_activo_fijo', sql.NVarChar, id)
                        .query("SELECT * FROM [dbo].[factura] WHERE id_activo_fijo = @id_activo_fijo");

                        let buff = null;
                        let name_file = null;
                        let type = null;

                        data.recordset.map(file=>{
                            buff = new Buffer(file.contenido_archivo).toString('utf8');
                            let decodedFile = new Buffer(buff, 'base64');

                            name_file = file.nombre_archivo;
                            type = file.tipo_archivo;
                            
                            try {
                                fs.writeFileSync(path.join(__dirname, '../temp/' + file.nombre_archivo), decodedFile);    
                            } catch (error) {
                                console.log('No se pudo crear los recursos. ', error.message);
                                res.status(500).send(error);
                            }
                            
                        });

                        const imgs_dir = fs.readdirSync(path.join(__dirname, '../temp/'));
                        
                        res.status(200).json(imgs_dir); 

                    } catch (error) {
                        console.log('No se pudo encontrar los registros. ', error.message);
                        res.status(500).send(error);
                    }
                    
                })
                .catch(error=>{
                    console.log('Connect Database Failed', error.message);
                    res.status(500).send(error);
                })
                .finally(()=>{
                    _pool.close();
                });
            
        }  catch (error) {
            console.log(error.message);
            res.status(500).send(error.message);
        }
    }

    async createEquipo(req, res){
        try {
            // console.log(req.body);

            if (req.body.id_activo_fijo != null && req.body.tipo != null && req.body.nombre != null && req.body.serie != null && req.body.fecha_compra != null && req.body.fecha_baja != null && req.body.estado != null && req.body.tipo_propiedad != null && req.body.id_os != null && req.body.id_fabricante != null && req.body.id_modelo != null) {
                let {id_activo_fijo, tipo, nombre, serie, fecha_compra, fecha_baja, estado, tipo_propiedad, id_os, id_fabricante, id_modelo} = req.body;

                fecha_baja = new Date(fecha_baja);
                fecha_compra = new Date(fecha_compra);

                let equipo = {
                    id_activo_fijo,
                    tipo,
                    nombre,
                    serie,
                    fecha_compra,
                    fecha_baja,
                    estado,
                    tipo_propiedad,
                    id_os,
                    id_fabricante,
                    id_modelo                
                }

                let objectEquipo = await _equipoService.create(equipo);

                if (!objectEquipo.message) {
                    _pool = _bdService.createInstance();

                    _pool.connect()
                        .then(async (pool)=>{
                            console.log('Conectado a MSSQL');
                            try {
                                const data = await pool.request()
                                .input('id_activo_fijo', sql.NVarChar, objectEquipo.id_activo_fijo)
                                .input('tipo', sql.NVarChar, objectEquipo.tipo)
                                .input('nombre', sql.NVarChar, objectEquipo.nombre)
                                .input('serie', sql.NVarChar, objectEquipo.serie)
                                .input('fecha_compra', sql.DateTime, objectEquipo.fecha_compra)
                                .input('fecha_baja', sql.DateTime, objectEquipo.fecha_baja)
                                .input('estado', sql.NVarChar, objectEquipo.estado)
                                .input('tipo_propiedad', sql.NVarChar, objectEquipo.tipo_propiedad)
                                .input('id_os', sql.NVarChar, objectEquipo.id_os)
                                .input('id_fabricante', sql.NVarChar, objectEquipo.id_fabricante)
                                .input('id_modelo', sql.NVarChar, objectEquipo.id_modelo)
                                .query("INSERT INTO [dbo].[equipo] (id_activo_fijo,tipo,nombre,serie,fecha_compra,fecha_baja,estado,tipo_propiedad,id_os,id_fabricante,id_modelo) VALUES (@id_activo_fijo,@tipo,@nombre,@serie,@fecha_compra,@fecha_baja,@estado,@tipo_propiedad,@id_os,@id_fabricante,@id_modelo)")
                                
                                if ((req.files.length == 0)) {
                                    res.status(200).json({data, error: 'No se cargaron los archivos'});
                                    return;
                                }

                                try {
                                    EquipoController.upFiles(req, res);
                                } catch (error) {
                                    console.log(error.message);
                                    res.status(500).send(error.message);
                                }
                                
                            } catch (error) {
                                console.log('Ha ocurrido un error ', error.message);
                                res.status(500).send(error);
                            }
                        })
                        .catch(error=>{
                            console.log('Connect Database Failed', error.message);
                            res.status(500).send(error);
                        })
                        .finally(()=>{
                            _pool.close();
                        });
                }else{
                    res.status(400).send('Error en el servidor ' + objectEquipo.message);
                }
            }else{
                res.status(500).send('El objeto no esta completo');
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).send(error.message);
        }
    }

    async deleteEquipo(req, res){

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
                    console.log('Conectado a MSSQL');
                    try {
                         data = await pool.request()
                        .input('id_activo_fijo', sql.NVarChar, id)
                        .query("DELETE FROM [dbo].[equipo] WHERE id_activo_fijo = @id_activo_fijo")
                    } catch (error) {
                        console.log('No se pudo eliminar el registro. ', error.message);
                        res.status(500).send(error);
                        return;
                    }
                })
                .catch((error)=>{
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

    async updateEquipo(req, res){
        try {
            let data;

            if (req.body.id_activo_fijo == null && req.body.tipo == null && req.body.nombre == null && req.body.serie == null && req.body.fecha_compra == null && req.body.fecha_baja == null && req.body.estado == null && req.body.tipo_propiedad == null && req.body.id_os == null && req.body.id_fabricante == null && req.body.id_modelo == null) {
                res.status(405).send('Error del cliente, faltan parametros');
                return;
            }

            let {id_activo_fijo, tipo, nombre, serie, fecha_compra, fecha_baja, estado, tipo_propiedad, id_os, id_fabricante, id_modelo}= req.body;

            fecha_compra = new Date(fecha_compra);
            fecha_baja = new Date(fecha_baja);

            let equipo = {
                id_activo_fijo,
                tipo,
                nombre,
                serie,
                fecha_compra,
                fecha_baja,
                estado,
                tipo_propiedad,
                id_os,
                id_fabricante,
                id_modelo                
            }

            let objectEquipo = await _equipoService.create(equipo);
            
            if (objectEquipo.message) {
                res.status(400).send('Error en el servidor ' + objectEquipo.message);
                return;
            }

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectado a MSSQL');
                    try {
                         data = await pool.request()
                         .input('id_activo_fijo', sql.NVarChar, objectEquipo.id_activo_fijo)
                         .input('tipo', sql.NVarChar, objectEquipo.tipo)
                         .input('nombre', sql.NVarChar, objectEquipo.nombre)
                         .input('serie', sql.NVarChar, objectEquipo.serie)
                         .input('fecha_compra', sql.DateTime, objectEquipo.fecha_compra)
                         .input('fecha_baja', sql.DateTime, objectEquipo.fecha_baja)
                         .input('estado', sql.NVarChar, objectEquipo.estado)
                         .input('tipo_propiedad', sql.NVarChar, objectEquipo.tipo_propiedad)
                         .input('id_os', sql.NVarChar, objectEquipo.id_os)
                         .input('id_fabricante', sql.NVarChar, objectEquipo.id_fabricante)
                         .input('id_modelo', sql.NVarChar, objectEquipo.id_modelo)
                        .query("UPDATE [dbo].[equipo] SET tipo = @tipo, nombre = @nombre, serie = @serie, fecha_compra = @fecha_compra, fecha_baja = @fecha_baja, estado = @estado, tipo_propiedad = @tipo_propiedad, id_os = @id_os, id_fabricante = @id_fabricante, id_modelo = @id_modelo WHERE id_activo_fijo = @id_activo_fijo")
                    } catch (error) {
                        console.log('No se pudo actualizar el registro. ', error.message);
                        res.status(500).send(error);
                        return;
                    }
                })
                .catch((error)=>{
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

    async getEquipo(req, res){
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
                    console.log('Conectado a MSSQL');
                    try {
                         data = await pool.request()
                        .input('id_activo_fijo', sql.NVarChar, id)
                        .query("SELECT e.id_activo_fijo, e.nombre, e.serie, e.tipo, e.fecha_compra, e.fecha_baja, e.estado, e.tipo_propiedad, o.nombre AS OS, m.nombre AS modelo, f.nombre AS fabricante FROM [dbo].[equipo] e, [dbo].[sistema_operativo] o, [dbo].[modelo] m, [dbo].[fabricante] f WHERE id_activo_fijo = @id_activo_fijo AND e.id_os = o.id_os AND e.id_modelo = m.id_modelo AND e.id_fabricante = f.id_fabricante")
                    } catch (error) {
                        console.log('No se pudo obtener el registro. ', error.message);
                        res.status(500).send(error);
                        return;
                    }
                })
                .catch((error)=>{
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

    async getAllEquipos(req, res){
        try {
            let data;

            _pool = _bdService.createInstance();

            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectado a MSSQL');
                    try {
                        data = await pool.request()
                        .query("SELECT e.id_activo_fijo, e.nombre, e.serie, e.tipo, e.fecha_compra, e.fecha_baja, e.estado, e.tipo_propiedad, o.nombre AS OS, m.nombre AS modelo, f.nombre AS fabricante FROM [dbo].[equipo] e, [dbo].[sistema_operativo] o, [dbo].[modelo] m, [dbo].[fabricante] f WHERE e.id_os = o.id_os AND e.id_modelo = m.id_modelo AND e.id_fabricante = f.id_fabricante")
                    } catch (error) {
                        console.log('No se pudo obtener los registros. ', error.message);
                        res.status(500).send(error);
                        return;
                    }
                })
                .catch((error)=>{
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

    async UploadFile(req, res){
        try {

            if ((req.files.length == 0) || (req.body.id_activo_fijo == undefined)) {
                // var test = await EquipoController.file('Pedro');
                res.status(500).send(new Error('No hay valores'));
                return;
            }

            EquipoController.upFiles(req, res);
            
        } catch (error) {
            console.log(error.message);
            res.status(500).send(error.message);
        }
    }

    async deleteFile(req, res){

        try{

            let data;

            if(req.params.id == null){
                res.status(405).send('Error del cliente, Id no enviado');
                return;
            }
    
            let {id} = req.params;
    
            _pool = _bdService.createInstance();
    
            await _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectado a MSSQL');
                    try {
                         data = await pool.request()
                        .input('id_factura', sql.Int, id)
                        .query("DELETE FROM [dbo].[factura] WHERE id_factura = @id_factura")
                    } catch (error) {
                        console.log('No se pudo eliminar el registro. ', error.message);
                        res.status(500).send(error);
                        return;
                    }
                })
                .catch((error)=>{
                    console.log('Connect Database Failed', error.message);
                    res.status(500).send(error);
                    return;
                })
                .finally(()=>{
                    _pool.close();
                    res.status(200).json(data);
                });

        }catch(error){
            console.log(error.message);
            res.status(500).send(error.message);
        }
        
        return;
    }

}

module.exports = EquipoController;