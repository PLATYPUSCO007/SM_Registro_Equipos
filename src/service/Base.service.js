class BaseService{
    constructor(repository){
        this.repository = repository;
    }

    async create(entity){
        if (!entity) {
            const error = new Error();
            error.status = 401;
            error.message = 'Entidad vacia';
            throw error;
        }

        return await this.repository.create(entity);
    }

    async getUser(){
        return await this.repository.getUser();
    }
}

module.exports = BaseService;