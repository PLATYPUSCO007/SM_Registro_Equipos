let _sistemaOperativoService = null;

class SistemaOperativoController {

    constructor({ SistemaOperativoService}) {
        _sistemaOperativoService = SistemaOperativoService;
        this.query = '';
    }

    async insert(req, res) {

        let {nombre, plataforma} = req.body;

        let SO = {
            nombre,
            plataforma
        }

        let objectSO = await _sistemaOperativoService.create(SO);

        if (objectSO.message) {
            res.status(400).send('Error en el servidor ' + objectSO.message);
            return;
        }

        this.query = `INSERT INTO [dbo].[sistema_operativo] 
            (nombre, plataforma) 
            VALUES (@nombre, @plataforma)`;

        await _sistemaOperativoService.queryByObject(objectSO, this.query)
            .then(result=>{
                res.status(200).send(objectSO);
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

        this.query = `DELETE FROM [dbo].[sistema_operativo] WHERE id_os = @id`;

        await _sistemaOperativoService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

    async update(req, res) {

        let {id, nombre, plataforma} = req.body;

        let SO = {
            nombre,
            plataforma
        }

        let objectSO = await _sistemaOperativoService.create(SO);

        if (objectSO.message) {
            res.status(400).send('Error en el servidor ' + objectSO.message);
            return;
        }

        objectSO.id = id;

        this.query = `UPDATE [dbo].[sistema_operativo]
            SET
            nombre = @nombre,
            plataforma = @plataforma 
            WHERE id_os = @id`;

        await _sistemaOperativoService.queryByObject(objectSO, this.query)
            .then(result=>{
                res.status(200).send(objectSO);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

    async getAll(req, res){
        this.query = `SELECT * FROM [dbo].[sistema_operativo]`;

        await _sistemaOperativoService.execute(this.query)
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

        this.query = `SELECT * FROM [dbo].[sistema_operativo] WHERE id_os = @id`;

        await _sistemaOperativoService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

}

module.exports = SistemaOperativoController;