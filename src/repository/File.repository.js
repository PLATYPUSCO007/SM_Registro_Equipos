const BaseRepository = require('./base.repository');

class FileRepository extends BaseRepository{
    constructor({File, BDrepository, BDService}){
        super(File, BDrepository, 'file');
        this.sql = BDService.getMSSQL();
        this.conn = null;
    }
    
    async bindObject(file, request){
        return new Promise(async (resolve, reject)=>{
            
            try {
                await request
                    .input('nombre_archivo', this.sql.NVarChar, file.nombre_archivo)
                    .input('tipo_archivo', this.sql.NVarChar, file.tipo_archivo)
                    .input('contenido_archivo', this.sql.VarBinary(this.sql.MAX), new Buffer(file.contenido_archivo))
                    .input('id_activo_fijo', this.sql.NVarChar, file.id_activo_fijo)
                resolve(request);    
            } catch (error) {
                reject(error);
            }
            

        }) 
    }
}

module.exports = FileRepository;