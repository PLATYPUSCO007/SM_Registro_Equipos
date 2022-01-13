const {ObjectModel} = require('objectmodel');

const Equipo = new ObjectModel({
    estado: String,
    fecha_baja: Date,
    fecha_compra: Date,
    id_activo_fijo: String,
    tipo: String,
    tipo_propiedad: String
});

Equipo.create = async function(equipo){
    return new Equipo(equipo);
}

module.exports = Equipo;