const BaseRepository = require('./base.repository');

class PerifericoRepository extends BaseRepository{
    constructor({Periferico, BDrepository, BDService}){
        super(Periferico, BDrepository, 'Periferico');
        this.sql = BDService.getMSSQL();
    }
    
    async bindObject(periferico, request){
        return new Promise(async (resolve, reject)=>{
            
            try {
                if (periferico.id) {
                    await request.input('id', this.sql.Int, periferico.id)    
                }
                await request
                    .input('tipo', this.sql.NVarChar, periferico.tipo)
                    .input('activo', this.sql.NVarChar, periferico.activo)
                    .input('fecha_asignacion', this.sql.DateTime, periferico.fecha_asignacion)
                    .input('fecha_retiro', this.sql.DateTime, periferico.fecha_retiro)
                    .input('motivo_retiro', this.sql.NVarChar, periferico.motivo_retiro)
                    .input('id_activo_fijo', this.sql.NVarChar, periferico.id_activo_fijo)
                resolve(request);    
            } catch (error) {
                reject(error);
            }
            

        }) 
    }
}

module.exports = PerifericoRepository;