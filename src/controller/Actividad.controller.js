let _actividadService = null;

class ActividadController {

    constructor({ ActividadService}) {
        _actividadService = ActividadService;
        this.query = '';
    }

    async insert(req, res) {

        let {nombre} = req.body;

        let Actividad = {
            nombre
        }

        let objectActividad = await _actividadService.create(Actividad);

        if (objectActividad.message) {
            res.status(400).send('Error en el servidor ' + objectActividad.message);
            return;
        }

        this.query = `INSERT INTO [dbo].[actividades] 
            (nombre) 
            VALUES (@nombre)`;

        await _actividadService.queryByObject(objectActividad, this.query)
            .then(result=>{
                res.status(200).send(objectActividad);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

    async delete(req, res){

        if(req.params.id == null){
            res.status(405).send('Error del cliente, Id no enviado');
            return;
        }

        let {id} = req.params;

        this.query = `DELETE FROM [dbo].[actividades] WHERE id_actividad = @id`;

        await _actividadService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

    async update(req, res) {

        let {id, nombre} = req.body;

        let Actividad = {
            nombre
        }

        let objectActividad = await _actividadService.create(Actividad);

        if (objectActividad.message) {
            res.status(400).send('Error en el servidor ' + objectActividad.message);
            return;
        }

        objectActividad.id = id;

        this.query = `UPDATE [dbo].[actividades]
            SET
            nombre = @nombre
            WHERE id_actividad = @id`;

        await _actividadService.queryByObject(objectActividad, this.query)
            .then(result=>{
                res.status(200).send(objectActividad);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

    async getAll(req, res){
        this.query = `SELECT * FROM [dbo].[actividades]`;

        await _actividadService.execute(this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

    async getById(req, res){

        if(req.params.id == null){
            res.status(405).send('Error del cliente, Id no enviado');
            return;
        }

        let {id} = req.params;

        this.query = `SELECT * FROM [dbo].[actividades] WHERE id_actividad = @id`;

        await _actividadService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

}

module.exports = ActividadController;