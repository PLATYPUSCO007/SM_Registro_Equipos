const {ObjectModel} = require('objectmodel');

const Asignacion = new ObjectModel({
    fecha_asignacion: Date,
    fecha_retiro: Date,
    identificacion: String,
    id_activo_fijo: String,
    motivo_asignacion: String,
    motivo_retiro: String,
    nombre_asignado: String,
    regional: String,
    tipo_asignacion: String,  
});

Asignacion.create = async function(asignacion){
    return new Asignacion(asignacion);
} 

module.exports = Asignacion;