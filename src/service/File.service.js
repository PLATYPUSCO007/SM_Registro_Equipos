const { ErrorHelper } = require("../helper");
const BaseService = require("./Base.service")
const fs = require('fs');
const path = require('path');
const fs_extra = require('fs-extra');

class FileService extends BaseService {

    constructor({FileRepository}){
        super(FileRepository);
        this._fileService = FileRepository;
        this.fileNew = null;
        this.query = '';
        this.conn = null;
    }

    async queryByFile(files, id_activo_fijo){
        
        return new Promise((resolve, reject)=>{
            
            this.query = `INSERT INTO [dbo].[factura] (nombre_archivo,tipo_archivo,contenido_archivo,id_activo_fijo) 
                        VALUES 
                        (@nombre_archivo,@tipo_archivo,@contenido_archivo,@id_activo_fijo)`;

            files.forEach(async (file, index) => {
                let tipo_archivo = file.mimetype;
                let nombre_archivo = file.originalname;        
                let buff = fs.readFileSync(path.join(__dirname, '../files/' + file.filename));
                let contenido_archivo = buff.toString('base64');    

                let fileModel = {
                    contenido_archivo,
                    id_activo_fijo,
                    nombre_archivo,
                    tipo_archivo
                }

                let objectFile = await this._fileService.create(fileModel);

                if (objectFile.message) {
                    reject('El objeto File, no ha sido creado!');
                }

                await super.queryByObject(objectFile, this.query)
                    .then( async (result)=>{

                        fs.unlink(path.join(__dirname, '../files/' + file.filename), (error)=>{
                            if (error) {
                                console.log('El archivo ' + file.filename + ' no se ha removido, remuevalo manualmente!');
                            }
                            console.log('El archivo '+ file.filename + ' se ha removido!');
                        })

                        if ((files.length - 1) == index) {

                            resolve('Archivos cargados con exito');
                        }
                    })
                    .catch(error=>{
                        console.log(error);
                        reject('Error en la operacion!, equipo creado con exito');
                    })
            })
        
        })
    }

    async getFilesDB(files) {

        return new Promise((resolve, reject)=>{

            let buff = null;
            let name_file = null;
            let type = null;

            files.map(file=>{
                buff = new Buffer(file.contenido_archivo).toString('utf8');
                let decodedFile = new Buffer(buff, 'base64');
    
                name_file = file.nombre_archivo;
                type = file.tipo_archivo;
                
                try {
                    fs.writeFileSync(path.join(__dirname, '../temp/' + file.nombre_archivo), decodedFile);    
                } catch (error) {
                    console.log('No se pudo crear los recursos. ', error.message);
                    reject('Error al devolver los archivos');
                }
                
            });

            const files_dir = fs.readdirSync(path.join(__dirname, '../temp/'));

            resolve(files_dir);

        });
    }

    async deleteFilesTemp(){
        
        return new Promise((resolve, reject)=>{
            try {
                fs_extra.emptyDirSync(path.join(__dirname, '../temp/'));  
                resolve('Carpeta TEMP vacia!');
            } catch (error) {
                console.log("🚀 ~ file: File.service.js ~ line 100 ~ FileService ~ returnnewPromise ~ error", error);
                reject('El directorio temporal no se ha limpiado!');
            }
        });
    }

}

module.exports = FileService;