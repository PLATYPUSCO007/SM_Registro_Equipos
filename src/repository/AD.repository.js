const BaseRepository = require('./base.repository');
let _user = null;

class AdRepository extends BaseRepository{
    constructor({User}){
        super(User);
        _user = User;
    }
}

module.exports = AdRepository;