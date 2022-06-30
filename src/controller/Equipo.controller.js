let _bdService = null;
let _equipoService = null;
let _fileService = null;
let _pool = null;
let sql = null;
const fs = require('fs');
const fs_extra = require('fs-extra');
const path = require('path');


class EquipoController {

    constructor({ BDService, EquipoService, FileService}) {
        _bdService = BDService;
        _equipoService = EquipoService;
        _fileService = FileService;
        sql = _bdService.getMSSQL();
        this.query = '';
    }

    async createEquipo(req, res){

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

        if (objectEquipo.message) {
            res.status(405).send('Error del cliente, Datos no validos');
            return;
        }

        this.query = `INSERT INTO [dbo].[equipo] 
            (id_activo_fijo,tipo,nombre,serie,fecha_compra,fecha_baja,estado,tipo_propiedad,id_os,id_fabricante,id_modelo) 
            VALUES 
            (@id_activo_fijo,@tipo,@nombre,@serie,@fecha_compra,@fecha_baja,@estado,@tipo_propiedad,@id_os,@id_fabricante,@id_modelo)`;
            
        await _equipoService.queryByObject(objectEquipo, this.query)
            .then(async (result)=>{

                if ((req.files.length !== 0)) {

                    let files = req.files;

                    await _fileService.queryByFile(files, id_activo_fijo)
                        .then(result=>{
                            res.status(200).send({objectEquipo, Archivos: `${result}`});
                            return true;
                        })
                        .catch(error=>{
                            res.status(200).send({objectEquipo, Archivos: `${error}`});
                            return true;
                        })        
                }

                res.status(200).send({objectEquipo, Archivos: null});
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

    async deleteEquipo(req, res){

        let {id} = req.params;

        this.query = `DELETE FROM [dbo].[equipo] WHERE id_activo_fijo = @id`;
        await _equipoService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la peticion');
            });
    }

    async updateEquipo(req, res){

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

        this.query = `UPDATE [dbo].[equipo] SET 
            tipo = @tipo, 
            nombre = @nombre, 
            serie = @serie, 
            fecha_compra = @fecha_compra, 
            fecha_baja = @fecha_baja, 
            estado = @estado, 
            tipo_propiedad = @tipo_propiedad, 
            id_os = @id_os, 
            id_fabricante = @id_fabricante, 
            id_modelo = @id_modelo 
            WHERE 
            id_activo_fijo = @id_activo_fijo`;
        
        await _equipoService.queryByObject(objectEquipo, this.query)
            .then(result=>{
                res.status(200).send(objectEquipo);
                return true;
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la peticion');
            });
    }

    async getEquipo(req, res){
        
        let {id} = req.params;

        this.query = `SELECT e.id_activo_fijo, e.nombre, e.serie, e.tipo, e.fecha_compra, 
            e.fecha_baja, e.estado, e.tipo_propiedad, o.nombre AS OS, m.nombre AS modelo, 
            f.nombre AS fabricante 
            FROM [dbo].[equipo] e, 
            [dbo].[sistema_operativo] o, 
            [dbo].[modelo] m, 
            [dbo].[fabricante] f 
            WHERE 
            id_activo_fijo = @id 
            AND 
            e.id_os = o.id_os 
            AND 
            e.id_modelo = m.id_modelo 
            AND 
            e.id_fabricante = f.id_fabricante`;

        await _equipoService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
                return true;
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la peticion');
            });
    }

    async getAllEquipos(req, res){

        this.query = `SELECT e.id_activo_fijo, e.nombre, e.serie, e.tipo, 
            e.fecha_compra, e.fecha_baja, e.estado, e.tipo_propiedad, o.nombre AS OS, 
            m.nombre AS modelo, f.nombre AS fabricante 
            FROM [dbo].[equipo] e, 
            [dbo].[sistema_operativo] o, 
            [dbo].[modelo] m, 
            [dbo].[fabricante] f 
            WHERE 
            e.id_os = o.id_os 
            AND 
            e.id_modelo = m.id_modelo 
            AND 
            e.id_fabricante = f.id_fabricante`;

        await _equipoService.execute(this.query)
            .then(result=>{
                res.status(200).send(result);
                return true;
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la peticion');
            });
    }

}

module.exports = EquipoController;