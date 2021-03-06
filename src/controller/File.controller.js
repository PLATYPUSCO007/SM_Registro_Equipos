let _fileService = null;

class FileController {

    constructor({ FileService}) {
        _fileService = FileService;
        this.query = '';
    }

    async createFile(req, res){
        
        if ((req.files.length !== 0)) {

            let files = req.files;
            let {id_referencia, tabla, campo} = req.body;

            await _fileService.queryByFile(files, id_referencia, tabla, campo)
                .then(result=>{
                    res.status(200).send(result);
                })
                .catch(error=>{
                    res.status(200).send({Archivos: `${error}`});
                    return true;
                })        
        }
    }

    async deleteFile(req, res){
        let {id, tabla, campo} = req.params;

        this.query = `DELETE FROM [dbo].[${tabla}] WHERE ${campo} = @id`;
        await _fileService.queryById(id, this.query)
            .then(result=>{
                res.status(200).send(result);
                return true;
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la peticion');
            });
    }

    async getFiles(req, res){
        let {id, tabla, campo} = req.params;

        this.query = `SELECT * FROM [dbo].[${tabla}] WHERE ${campo} = @id`;
        await _fileService.queryById(id, this.query)
            .then(async (files)=>{

                await _fileService.deleteFilesTemp();
                const files_dir = await _fileService.getFilesDB(files);

                res.status(200).send(files_dir);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la peticion');
            });
    }

}

module.exports = FileController;