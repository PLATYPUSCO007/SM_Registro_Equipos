let _tecnicoService = null;

class TecnicoController {

    constructor({ TecnicoService}) {
        _tecnicoService = TecnicoService;
        this.query = '';
    }

    async insert(req, res) {

        let {nombre, cargo} = req.body;

        let Tecnico = {
            nombre,
            cargo
        }

        let objectTecnico = await _tecnicoService.create(Tecnico);

        if (objectTecnico.message) {
            res.status(400).send('Error en el servidor ' + objectTecnico.message);
            return;
        }

        this.query = `INSERT INTO [dbo].[tecnicos] 
            (nombre, cargo) 
            VALUES (@nombre, @cargo)`;

        await _tecnicoService.queryByObject(objectTecnico, this.query)
            .then(result=>{
                res.status(200).send(objectTecnico);
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

        this.query = `DELETE FROM [dbo].[tecnicos] WHERE id_tecnico = @id`;

        await _tecnicoService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

    async update(req, res) {

        let {id, nombre, cargo} = req.body;

        let Tecnico = {
            nombre,
            cargo
        }

        let objectTecnico = await _tecnicoService.create(Tecnico);

        if (objectTecnico.message) {
            res.status(400).send('Error en el servidor ' + objectTecnico.message);
            return;
        }

        objectTecnico.id = id;

        this.query = `UPDATE [dbo].[tecnicos]
            SET
            nombre = @nombre,
            cargo = @cargo 
            WHERE id_tecnico = @id`;

        await _tecnicoService.queryByObject(objectTecnico, this.query)
            .then(result=>{
                res.status(200).send(objectTecnico);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

    async getAll(req, res){
        this.query = `SELECT * FROM [dbo].[tecnicos]`;

        await _tecnicoService.execute(this.query)
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

        this.query = `SELECT * FROM [dbo].[tecnicos] WHERE id_tecnico = @id`;

        await _tecnicoService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

}

module.exports = TecnicoController;