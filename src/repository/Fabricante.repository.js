const BaseRepository = require('./base.repository');

class FabricanteRepository extends BaseRepository{
    constructor({Fabricante, BDrepository, BDService}){
        super(Fabricante, BDrepository, 'Fabricante');
        this.sql = BDService.getMSSQL();
    }
    
    async bindObject(fabricante, request){
        return new Promise(async (resolve, reject)=>{
            
            try {
                if (fabricante.id) {
                    await request.input('id', this.sql.Int, fabricante.id)    
                }
                await request
                    .input('nombre', this.sql.NVarChar, fabricante.nombre)
                    .input('nit', this.sql.NVarChar, fabricante.nit)
                resolve(request);    
            } catch (error) {
                reject(error);
            }
            

        }) 
    }
}

module.exports = FabricanteRepository;