const BaseRepository = require('./base.repository');

class MantenimientoRepository extends BaseRepository{
    constructor({Mantenimiento, BDrepository, BDService}){
        super(Mantenimiento, BDrepository, 'Mantenimiento');
        this.sql = BDService.getMSSQL();
    } 

    async bindObject(mantenimiento, request){
        return new Promise(async (resolve, reject)=>{
            
            try {
                if (mantenimiento.id) {
                    await request.input('id', this.sql.Int, mantenimiento.id)    
                }
                await request
                    .input('fecha_mantenimiento', this.sql.DateTime, mantenimiento.fecha_mantenimiento)
                    .input('id_activo_fijo', this.sql.NVarChar, mantenimiento.id_activo_fijo)
                    .input('id_tecnico', this.sql.Int, mantenimiento.id_tecnico)
                    .input('observaciones', this.sql.NVarChar, mantenimiento.observaciones)
                    .input('tipo', this.sql.NVarChar, mantenimiento.tipo)
                resolve(request);     
            } catch (error) {
                reject(error);
            }
        }) 
    }
} 

module.exports = MantenimientoRepository;