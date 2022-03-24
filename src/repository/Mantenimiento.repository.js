const BaseRepository = require('./base.repository');

class MantenimientoRepository extends BaseRepository{
    constructor({Mantenimiento}){
        super(Mantenimiento);
    } 
} 

module.exports = MantenimientoRepository;