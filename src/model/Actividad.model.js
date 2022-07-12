const {ObjectModel} = require('objectmodel');

const Actividad = new ObjectModel({
    nombre: String
});

Actividad.create = async function(actividad){
    return new Actividad(actividad);
}

module.exports = Actividad;