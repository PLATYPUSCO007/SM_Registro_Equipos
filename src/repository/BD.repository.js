const mssql = require('mssql');

class BDrepository{
    #conn;

    constructor({DbConfig}){
        this.DbConfig = DbConfig;
        this.request = null;
        this.data = null;
    }

    async connect(){
        return new Promise(async (resolve, reject)=>{
            this.#conn = new mssql.ConnectionPool(this.DbConfig);
            await this.#conn.connect().then(pool=>{
                this.request = pool.request();
                resolve(this.request)
            }).catch(error=>{
                reject(error)
            })
        })
    }

    async execute(query){

        return new Promise(async (resolve, reject)=>{
            await this.request.query(query)
                .then(result=>{
                    resolve(result.recordset)
                })
                .catch(error=>{
                    reject(error)
                });
        })
    }

    async close(){
        await this.#conn.close();
    }

}

module.exports = BDrepository;