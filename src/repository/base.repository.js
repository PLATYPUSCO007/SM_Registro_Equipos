
class BaseRepository{

    constructor(model){
        this.model = model;
    }

    async create(entity){
        return this.model.create(entity);
    }

    async getUser(){
        return await this.model.getUser();
    }

}

module.exports = BaseRepository;