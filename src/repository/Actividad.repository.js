const BaseRepository = require('./base.repository');

class ActividadRepository extends BaseRepository{
    constructor({Actividad, BDrepository, BDService}){
        super(Actividad, BDrepository, 'Actividad');
        this.sql = BDService.getMSSQL();
    }
    
    async bindObject(actividad, request){
        return new Promise(async (resolve, reject)=>{
            
            try {
                if (actividad.id) {
                    await request.input('id', this.sql.Int, actividad.id)    
                }
                await request
                    .input('nombre', this.sql.NVarChar, actividad.nombre)
                resolve(request);    
            } catch (error) {
                reject(error);
            }
            

        }) 
    }
}

module.exports = ActividadRepository;