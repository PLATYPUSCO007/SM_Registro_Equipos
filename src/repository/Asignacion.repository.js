const BaseRepository = require('./base.repository');

class AsignacionRepository extends BaseRepository{
    constructor({Asignacion}){
        super(Asignacion);
    } 
} 

module.exports = AsignacionRepository;