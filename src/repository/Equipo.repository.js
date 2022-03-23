const BaseRepository = require('./base.repository');

class EquipoRepository extends BaseRepository{
    constructor({Equipo}){
        super(Equipo);
    } 
} 

module.exports = EquipoRepository;