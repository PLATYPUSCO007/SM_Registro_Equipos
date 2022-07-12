const BaseRepository = require('./base.repository');

class TecnicoRepository extends BaseRepository{
    constructor({Tecnico, BDrepository, BDService}){
        super(Tecnico, BDrepository, 'Tecnico');
        this.sql = BDService.getMSSQL();
    }
    
    async bindObject(tecnico, request){
        return new Promise(async (resolve, reject)=>{
            
            try {
                if (tecnico.id) {
                    await request.input('id', this.sql.Int, tecnico.id)    
                }
                await request
                    .input('nombre', this.sql.NVarChar, tecnico.nombre)
                    .input('cargo', this.sql.NVarChar, tecnico.cargo)
                resolve(request);    
            } catch (error) {
                reject(error);
            }
            

        }) 
    }
}

module.exports = TecnicoRepository;