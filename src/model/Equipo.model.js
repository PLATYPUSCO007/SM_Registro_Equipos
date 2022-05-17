const {ObjectModel} = require('objectmodel');

const Equipo = new ObjectModel({
    estado: String,
    fecha_baja: Date,
    fecha_compra: Date,
    id_activo_fijo: String,
    id_fabricante: String,
    id_modelo: String, 
    id_os: String,
    nombre: String,
    serie: String,
    tipo: String,
    tipo_propiedad: String
});

Equipo.create = async function(equipo){
    return new Equipo(equipo);
}

module.exports = Equipo;