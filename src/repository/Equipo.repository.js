const BaseRepository = require('./base.repository');

class EquipoRepository extends BaseRepository{
    constructor({Equipo, BDrepository, BDService}){
        super(Equipo, BDrepository, 'Equipo');
        this.sql = BDService.getMSSQL();
    } 

    async bindObject(equipo, request){
        return new Promise(async (resolve, reject)=>{
            
            try {
                if (equipo.id) {
                    await request.input('id', this.sql.NVarChar, equipo.id)
                }
                await request
                    .input('id_activo_fijo', this.sql.NVarChar, equipo.id_activo_fijo)
                    .input('tipo', this.sql.NVarChar, equipo.tipo)
                    .input('nombre', this.sql.NVarChar, equipo.nombre)
                    .input('serie', this.sql.NVarChar, equipo.serie)
                    .input('fecha_compra', this.sql.DateTime, equipo.fecha_compra)
                    .input('fecha_baja', this.sql.DateTime, equipo.fecha_baja)
                    .input('estado', this.sql.NVarChar, equipo.estado)
                    .input('tipo_propiedad', this.sql.NVarChar, equipo.tipo_propiedad)
                    .input('id_os', this.sql.NVarChar, equipo.id_os)
                    .input('id_fabricante', this.sql.NVarChar, equipo.id_fabricante)
                    .input('id_modelo', this.sql.NVarChar, equipo.id_modelo)
                resolve(request);    
            } catch (error) {
                reject(error);
            }
            

        }) 
    }
} 

module.exports = EquipoRepository;