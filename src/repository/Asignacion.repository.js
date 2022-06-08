const BaseRepository = require('./base.repository');

class AsignacionRepository extends BaseRepository{

    constructor({Asignacion, BDrepository, BDService}){
        super(Asignacion, BDrepository, 'Asignacion');
        this.sql = BDService.getMSSQL();
        this.data = null;
    }

    async bindAsignacion(asignacion, request){
        return new Promise(async (resolve, reject)=>{
            
            try {
                if (asignacion.id) {
                    await request .input('id', this.sql.Int, asignacion.id)    
                }
                await request
                    .input('fecha_asignacion', this.sql.DateTime, asignacion.fecha_asignacion)
                    .input('fecha_retiro', this.sql.DateTime, asignacion.fecha_retiro)
                    .input('identificacion', this.sql.NVarChar, asignacion.identificacion)
                    .input('id_activo_fijo', this.sql.NVarChar, asignacion.id_activo_fijo)
                    .input('motivo_asignacion', this.sql.NVarChar, asignacion.motivo_asignacion)
                    .input('motivo_retiro', this.sql.NVarChar, asignacion.motivo_retiro)
                    .input('nombre_asignado', this.sql.NVarChar, asignacion.nombre_asignado)
                    .input('regional', this.sql.NVarChar, asignacion.regional)
                    .input('tipo_asignacion', this.sql.NVarChar, asignacion.tipo_asignacion)
                resolve(request);    
            } catch (error) {
                reject(error);
            }
            

        }) 
    }

} 

module.exports = AsignacionRepository; 