const BaseRepository = require('./base.repository');

class ModeloRepository extends BaseRepository{
    constructor({Modelo, BDrepository, BDService}){
        super(Modelo, BDrepository, 'Modelo');
        this.sql = BDService.getMSSQL();
    }
    
    async bindObject(modelo, request){
        return new Promise(async (resolve, reject)=>{
            
            try {
                if (modelo.id) {
                    await request.input('id', this.sql.Int, modelo.id)    
                }
                await request
                    .input('id_fabricante', this.sql.NVarChar, modelo.id_fabricante)
                    .input('nombre', this.sql.NVarChar, modelo.nombre)
                resolve(request);    
            } catch (error) {
                reject(error);
            }
            

        }) 
    }
}

module.exports = ModeloRepository;