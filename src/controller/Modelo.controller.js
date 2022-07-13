let _modeloService = null;

class ModeloController {

    constructor({ ModeloService}) {
        _modeloService = ModeloService;
        this.query = '';
    }

    async insert(req, res) {

        let {nombre, id_fabricante} = req.body;

        let Modelo = {
            id_fabricante,
            nombre
        }

        let objectModelo = await _modeloService.create(Modelo);

        if (objectModelo.message) {
            res.status(400).send('Error en el servidor ' + objectModelo.message);
            return;
        }

        this.query = `INSERT INTO [dbo].[modelo] 
            (nombre, id_fabricante) 
            VALUES (@nombre, @id_fabricante)`;

        await _modeloService.queryByObject(objectModelo, this.query)
            .then(result=>{
                res.status(200).send(objectModelo);
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

        this.query = `DELETE FROM [dbo].[modelo] WHERE id_modelo = @id`;

        await _modeloService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

    async update(req, res) {

        let {id, nombre, id_fabricante} = req.body;

        let Modelo = {
            id_fabricante,
            nombre
        }

        let objectModelo = await _modeloService.create(Modelo);

        if (objectModelo.message) {
            res.status(400).send('Error en el servidor ' + objectModelo.message);
            return;
        }

        objectModelo.id = id;

        this.query = `UPDATE [dbo].[modelo]
            SET
            nombre = @nombre,
            id_fabricante = @id_fabricante 
            WHERE id_modelo = @id`;

        await _modeloService.queryByObject(objectModelo, this.query)
            .then(result=>{
                res.status(200).send(objectModelo);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

    async getAll(req, res){
        this.query = `SELECT * FROM [dbo].[modelo]`;

        await _modeloService.execute(this.query)
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

        this.query = `SELECT * FROM [dbo].[modelo] WHERE id_modelo = @id`;

        await _modeloService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

    async getByFabricante(req, res){

        if(req.params.id == null){
            res.status(405).send('Error del cliente, Id no enviado');
            return;
        }

        let {id} = req.params;

        this.query = `SELECT * FROM [dbo].[modelo] WHERE id_fabricante = @id`;

        await _modeloService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }
    
}

module.exports = ModeloController;