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

            if (req.body.id_activo_fijo != null && req.body.tipo != null && req.body.fecha_compra != null && req.body.fecha_baja != null && req.body.estado != null && req.body.tipo_propiedad != null) {
                let {id_activo_fijo, tipo, fecha_compra, fecha_baja, estado, tipo_propiedad} = req.body;

                fecha_baja = new Date(fecha_baja);
                fecha_compra = new Date(fecha_compra);

                let equipo = {
                    id_activo_fijo,
                    tipo,
                    fecha_compra,
                    fecha_baja,
                    estado,
                    tipo_propiedad                
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
                                .input('fecha_compra', sql.DateTime, objectEquipo.fecha_compra)
                                .input('fecha_baja', sql.DateTime, objectEquipo.fecha_baja)
                                .input('estado', sql.NVarChar, objectEquipo.estado)
                                .input('tipo_propiedad', sql.NVarChar, objectEquipo.tipo_propiedad)
                                .query("INSERT INTO [dbo].[equipo] (id_activo_fijo,tipo,fecha_compra,fecha_baja,estado,tipo_propiedad) VALUES (@id_activo_fijo,@tipo,@fecha_compra,@fecha_baja,@estado,@tipo_propiedad)")
                                
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