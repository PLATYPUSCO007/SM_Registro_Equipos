const { ErrorHelper } = require("../helper");

class BaseService{

    #data;

    constructor(repository){
        this.repository = repository;
        this.conn = null;
    }

    async create(object){ 
        try { 
            this.objectNew = await this.repository.create(object);
            return this.objectNew;
        } catch (error) {
            return ErrorHelper.generateError(`El modelo ${this.repository.name} no es valido ` + error.message, 400);
        }
    }

    async getUser(){
        return await this.repository.getUser();
    }

    async execute(query){
        try {
            this.conn = await this.repository.connect();
            this.#data = await this.repository.execute(query);
            return this.#data;
        } catch (error) {
            console.log(`Error en el service ${this.repository.name}`);
            return error;
        }        
    }

    async queryById(id, query){
        this.conn = await this.repository.connect();
        await this.repository.bindId(id, this.conn);
        return new Promise(async (resolve, reject)=>{
            await this.repository.execute(query)
                .then(result=>{
                    resolve(result);
                })
                .catch(error=>{
                    reject(error);
                });
        })
    }

    async queryByObject(object, query){
        this.conn = await this.repository.connect();
        await this.repository.bindObject(object, this.conn);
        return new Promise(async (resolve, reject)=>{
            await this.repository.execute(query)
                .then(result=>{
                    resolve(result);
                })
                .catch(error=>{
                    reject(error);
                })
        })
    }

    async get(){
        return Promise.resolve(this.repository.name);
    }
}

module.exports = BaseService;