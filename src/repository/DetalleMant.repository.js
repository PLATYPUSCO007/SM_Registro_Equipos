const BaseRepository = require('./base.repository');

class DetalleMantenimientoRepository extends BaseRepository{
    constructor({DetalleMantenimiento, BDrepository, BDService}){
        super(DetalleMantenimiento, BDrepository, 'DetalleMantenimiento');
        this.sql = BDService.getMSSQL();
    } 

    async bindObject(detalleMantenimiento, request){
        return new Promise(async (resolve, reject)=>{
            
            try {
                if (detalleMantenimiento.id) {
                    await request.input('id', this.sql.Int, detalleMantenimiento.id)    
                }
                await request
                    .input('id_actividad', this.sql.Int, detalleMantenimiento.id_actividad)
                    .input('id_mantenimiento', this.sql.Int, detalleMantenimiento.id_mantenimiento)
                resolve(request);    
            } catch (error) {
                reject(error);
            }
        }) 
    }
} 

module.exports = DetalleMantenimientoRepository;