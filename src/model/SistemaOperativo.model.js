const {ObjectModel} = require('objectmodel');

const SistemaOperativo = new ObjectModel({
    nombre: String,
    plataforma: String
});

SistemaOperativo.create = async function(sistemaOperativo){
    return new SistemaOperativo(sistemaOperativo);
}

module.exports = SistemaOperativo;