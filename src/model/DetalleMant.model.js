const {ObjectModel} = require('objectmodel');

const DetalleMantenimiento = new ObjectModel({
    id_actividad: String,
    id_mantenimiento: String
});

DetalleMantenimiento.create = async function(detallemantenimiento){
    return new DetalleMantenimiento(detallemantenimiento);
}

module.exports = DetalleMantenimiento; 