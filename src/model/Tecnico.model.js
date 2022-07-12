const {ObjectModel} = require('objectmodel');

const Tecnico = new ObjectModel({
    nombre: String,
    cargo: String
});

Tecnico.create = async function(tecnico){
    return new Tecnico(tecnico);
}

module.exports = Tecnico;