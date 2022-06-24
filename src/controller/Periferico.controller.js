let _bdService = null;
let _perifericoService = null;
let _pool = null;
let sql = null;

class PerifericoController {

    constructor({ BDService, PerifericoService}) {
        _bdService = BDService;
        _perifericoService = PerifericoService;
        sql = _bdService.getMSSQL();
        this.query = '';
    }

    async insertPeriferico(req, res) {

        let {tipo, activo, fecha_asignacion, fecha_retiro, motivo_retiro, id_activo_fijo} = req.body;
        fecha_asignacion = new Date(fecha_asignacion);
        fecha_retiro = new Date(fecha_retiro);
        let periferico = {
            tipo,
            activo,
            fecha_asignacion,
            fecha_retiro,
            motivo_retiro,
            id_activo_fijo
        }
        let Objectperiferico = await _perifericoService.create(periferico);
        
        if (Objectperiferico.message) {
            res.status(400).send('Error en el servidor ' + Objectperiferico.message);
            return;
        }
        this.query = `INSERT INTO [dbo].[perifericos] 
            (tipo,activo,fecha_asignacion,fecha_retiro,motivo_retiro,id_activo_fijo) 
            VALUES 
            (@tipo,@activo,@fecha_asignacion,@fecha_retiro,@motivo_retiro,@id_activo_fijo)`;
        await _perifericoService.queryByObject(Objectperiferico, this.query)
            .then(result=>{
                res.status(200).send(Objectperiferico);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            })
    }

    async deletePeriferico(req, res) {
        
        if(req.params.id == null){
            res.status(405).send('Error del cliente, Id no enviado');
            return;
        }

        let {id} = req.params;

        this.query = `DELETE FROM [dbo].[perifericos] WHERE id_periferico = @id`
            
        await _perifericoService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la peticion');
            });
    }

    async updatePeriferico(req, res) {

        let {id, tipo, activo, fecha_asignacion, fecha_retiro, motivo_retiro, id_activo_fijo} = req.body;
        fecha_asignacion = new Date(fecha_asignacion);
        fecha_retiro = new Date(fecha_retiro);
        let periferico = {
            tipo,
            activo,
            fecha_asignacion,
            fecha_retiro,
            motivo_retiro,
            id_activo_fijo
        }
        let Objectperiferico = await _perifericoService.create(periferico);
            
        if (Objectperiferico.message) {
            res.status(400).send('Error en el servidor ' + Objectperiferico.message);
            return;
        }
        Objectperiferico.id = id;
        this.query = `UPDATE [dbo].[perifericos] 
            SET 
            tipo = @tipo, 
            activo = @activo, 
            fecha_asignacion = @fecha_asignacion, 
            fecha_retiro = @fecha_retiro, 
            motivo_retiro = @motivo_retiro, 
            id_activo_fijo = @id_activo_fijo 
            WHERE 
            id_periferico = @id`;
        await _perifericoService.queryByObject(Objectperiferico, this.query)
            .then(result=>{
                res.status(200).send(Objectperiferico);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la peticion');
            });
    }

    async getPerifericos(req, res) {

        this.query = `SELECT * FROM [dbo].[perifericos]`;

        await _perifericoService.execute(this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la peticion');
            });
    }

    async getPerifericosById(req, res) {

        if(req.params.id == null){ 
            res.status(405).send('Error del cliente, Id no enviado');
            return;
        }

        let {id} = req.params;

        this.query = `SELECT * FROM [dbo].[perifericos] WHERE id_periferico = @id`

        await _perifericoService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la peticion');
            });
    }

    async getPerifericosByIdEquipo(req, res) {

        if(req.params.id == null){ 
            res.status(405).send('Error del cliente, Id no enviado');
            return;
        }

        let {id} = req.params;

        this.query = `SELECT * FROM [dbo].[perifericos] WHERE id_activo_fijo = @id`

        await _perifericoService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la peticion');
            });
    }
}

module.exports = PerifericoController;