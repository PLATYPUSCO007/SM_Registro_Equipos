const BaseRepository = require('./base.repository');

class PerifericoRepository extends BaseRepository{
    constructor({Periferico}){
        super(Periferico);
    } 
}

module.exports = PerifericoRepository;