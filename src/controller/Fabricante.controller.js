let _fabricanteService = null;

class FabricanteController {

    constructor({ FabricanteService}) {
        _fabricanteService = FabricanteService;
        this.query = '';
    }

    async insert(req, res) {

        let {nombre, nit} = req.body;

        let Fabricante = {
            nombre,
            nit
        }

        let objectFabricante = await _fabricanteService.create(Fabricante);

        if (objectFabricante.message) {
            res.status(400).send('Error en el servidor ' + objectFabricante.message);
            return;
        }

        this.query = `INSERT INTO [dbo].[fabricante] 
            (nombre, nit) 
            VALUES (@nombre, @nit)`;

        await _fabricanteService.queryByObject(objectFabricante, this.query)
            .then(result=>{
                res.status(200).send(objectFabricante);
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

        this.query = `DELETE FROM [dbo].[fabricante] WHERE id_fabricante = @id`;

        await _fabricanteService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

    async update(req, res) {

        let {id, nombre, nit} = req.body;

        let Fabricante = {
            nombre,
            nit
        }

        let objectFabricante = await _fabricanteService.create(Fabricante);

        if (objectFabricante.message) {
            res.status(400).send('Error en el servidor ' + objectFabricante.message);
            return;
        }

        objectFabricante.id = id;

        this.query = `UPDATE [dbo].[fabricante]
            SET
            nombre = @nombre,
            nit = @nit 
            WHERE id_fabricante = @id`;

        await _fabricanteService.queryByObject(objectFabricante, this.query)
            .then(result=>{
                res.status(200).send(objectFabricante);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

    async getAll(req, res){
        this.query = `SELECT * FROM [dbo].[fabricante]`;

        await _fabricanteService.execute(this.query)
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

        this.query = `SELECT * FROM [dbo].[fabricante] WHERE id_fabricante = @id`;

        await _fabricanteService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

    async getByNit(req, res){

        if(req.params.id == null){
            res.status(405).send('Error del cliente, Id no enviado');
            return;
        }

        let {id} = req.params;

        this.query = `SELECT * FROM [dbo].[fabricante] WHERE nit = @id`;

        await _fabricanteService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

}

module.exports = FabricanteController;