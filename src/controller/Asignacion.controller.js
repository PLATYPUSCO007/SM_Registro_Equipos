const res = require("express/lib/response");

let _bdService = null;
let _asignacionService = null;
let _pool = null;
let sql = null;

class AsignacionController {
    
    
    constructor({ BDService, AsignacionService}) {
        _bdService = BDService;
        _asignacionService = AsignacionService;
        sql = _bdService.getMSSQL();
        this.query = '';
        this.result = null;
    }

    async getVal(req, res){
        let result = await _asignacionService.get();
        console.log(result);
        res.status(200).send(result);
    }

    // async getData(req, res){
    //     this.query = 'SELECT * FROM [dbo].[asignacion]';
    //     this.result = await _asignacionService.execute(this.query);
    //     console.log(this.result);
    //     res.status(200).send(this.result);
    // }

    async createAsignacion(req, res){
        
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

        this.query = `INSERT INTO [dbo].[asignacion] 
                        (fecha_asignacion, fecha_retiro, identificacion, id_activo_fijo, motivo_asignacion, motivo_retiro, nombre_asignado, regional, tipo_asignacion) 
                        VALUES 
                        (@fecha_asignacion, @fecha_retiro, @identificacion, @id_activo_fijo, @motivo_asignacion, @motivo_retiro, @nombre_asignado, @regional, @tipo_asignacion)`;
        await _asignacionService.queryByObject(objectAsignacion, this.query)
            .then(result=>{
                res.status(200).send(objectAsignacion);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

    async updateAsignacion(req, res){

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

        objectAsignacion.id = id;

        this.query = `UPDATE [dbo].[asignacion] SET 
                        fecha_asignacion = @fecha_asignacion, 
                        fecha_retiro = @fecha_retiro, 
                        identificacion = @identificacion, 
                        id_activo_fijo = @id_activo_fijo, 
                        motivo_asignacion = @motivo_asignacion, 
                        motivo_retiro = @motivo_retiro, 
                        nombre_asignado = @nombre_asignado, 
                        regional = @regional, 
                        tipo_asignacion = @tipo_asignacion 
                        WHERE 
                        id_asignacion = @id`;

        await _asignacionService.queryByObject(objectAsignacion, this.query)
            .then(result=>{
                res.status(200).send(objectAsignacion);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

    async getAllAsignacion(req, res){

        this.query = `SELECT * FROM [dbo].[asignacion]`;
        await _asignacionService.execute(this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            })
    }

    async getAsignacion(req, res){

        if (req.params.id == null) {
            res.status(405).send('Error del cliente, Id no enviado');
            return;
        }
        
        let {id} = req.params;
        
        this.query = 'SELECT * FROM [dbo].[asignacion] WHERE id_asignacion = @id';
        await _asignacionService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la peticion');
            });
    }

    async deleteAsignacion(req, res){

        if (req.params.id == null) {
            res.status(405).send('Error del cliente, Id no enviado');
            return;
        }

        let {id} = req.params;
        
        this.query = `DELETE FROM [dbo].[asignacion] WHERE id_asignacion = @id`;
        await _asignacionService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la peticion');
            });
    }

}

module.exports = AsignacionController;