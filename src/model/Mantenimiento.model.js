const {ObjectModel} = require('objectmodel');

const Mantenimiento = new ObjectModel({
    fecha_mantenimiento: Date,
    id_activo_fijo: String,
    id_tecnico: String,
    observaciones: String,
    tipo: String
});

Mantenimiento.create = async function(mantenimiento){
    return new Mantenimiento(mantenimiento);
}

module.exports = Mantenimiento;