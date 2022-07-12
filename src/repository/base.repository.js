
class BaseRepository{

    constructor(model, BDrepository, name = ''){
        this.model = model;
        this.BDRepository = BDrepository;
        this.name = name;
    }

    async create(entity){
        return this.model.create(entity);
    } 

    async getUser(){
        return await this.model.getUser();
    }

    async connect(){
        let conn = await this.BDRepository.connect();
        return conn;
    }

    async close(){
        await this.BDRepository.close();
    }

    async execute(query){
        let data = await this.BDRepository.execute(query);
        return data;
    }

    async bindId(id, request){
        const regex = new RegExp('[\\D]+', 'g');
        if (regex.test(id)) {
            return Promise.resolve(await request.input('id', this.sql.NVarChar, id));    
        }else{
            return Promise.resolve(await request.input('id', this.sql.Int, id));
        }
    }
    
    async bindObject(id, request){
        return Promise.resolve('Insert');
    }

}

module.exports = BaseRepository; 