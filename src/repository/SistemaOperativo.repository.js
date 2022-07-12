const BaseRepository = require('./base.repository');

class SistemaOperativoRepository extends BaseRepository{
    constructor({SistemaOperativo, BDrepository, BDService}){
        super(SistemaOperativo, BDrepository, 'Sistema Operativo');
        this.sql = BDService.getMSSQL();
    }
    
    async bindObject(sistemaoperativo, request){
        return new Promise(async (resolve, reject)=>{
            
            try {
                if (sistemaoperativo.id) {
                    await request.input('id', this.sql.Int, sistemaoperativo.id)    
                }
                await request
                    .input('nombre', this.sql.NVarChar, sistemaoperativo.nombre)
                    .input('plataforma', this.sql.NVarChar, sistemaoperativo.plataforma)
                resolve(request);    
            } catch (error) {
                reject(error);
            }
            

        }) 
    }
}

module.exports = SistemaOperativoRepository;