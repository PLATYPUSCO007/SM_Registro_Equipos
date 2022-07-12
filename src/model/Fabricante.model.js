const {ObjectModel} = require('objectmodel');

const Fabricante = new ObjectModel({
    nombre: String,
    nit: String
});

Fabricante.create = async function(fabricante){
    return new Fabricante(fabricante);
}

module.exports = Fabricante;