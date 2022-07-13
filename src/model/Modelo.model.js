const {ObjectModel} = require('objectmodel');

const Modelo = new ObjectModel({
    id_fabricante: String,
    nombre: String
});

Modelo.create = async function(modelo){
    return new Modelo(modelo);
}

module.exports = Modelo;