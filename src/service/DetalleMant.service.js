const { ErrorHelper } = require("../helper");
const BaseService = require("./Base.service");

class DetalleMantenimientoService extends BaseService { 

    constructor({DetalleMantRepository}){
        super(DetalleMantRepository);
        this._detallemantenimientoService = DetalleMantRepository;
        this.detallemantenimientoNew = null;
        this.query = '';
    }

    async queryByDetalleMant(detalleMant, query){
        
        return new Promise((resolve, reject)=>{

            var {actividades, id_mantenimiento, id} = detalleMant;

            actividades.forEach(async (actividad, index) => {
                let detalleModel = {
                    id_actividad: actividad.toString(),
                    id_mantenimiento: id_mantenimiento.toString()
                }

                this.detallemantenimientoNew = await super.create(detalleModel)

                if (this.detallemantenimientoNew.message) {
                    reject('El objeto File, no ha sido creado!');
                }

                if (id) {
                    this.detallemantenimientoNew.id = id[index];
                }

                await super.queryByObject(this.detallemantenimientoNew, query)
                    .then(result=>{
                        if ((actividades.length - 1) == index) {
                            resolve('Detalles de Mantenimiento cargados con exito');
                        }
                    })
                    .catch(error=>{
                        console.log(error);
                        reject('Error en la operacion!, mantenimiento procesado con exito');
                    })

            });
        });
    }

}

module.exports = DetalleMantenimientoService; 