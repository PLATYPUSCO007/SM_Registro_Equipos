let config_db = {};
const mssql = require('mssql');

var createInstance = {};

class BDService {

    constructor({ config, BDrepository }) {
        config_db = {
            user: config.USER_DB,
            password: config.PASS_DB,
            server: config.SQL_SERVER,
            database: config.DATABASE,
            options: {
                trustedconnection: false,
                enableArithAbort: true,
                encrypt: false
                //instancename: INSTANCE_NAME
            },
            port: parseInt(config.PORT_DB)
        }

        this.BDRepository = BDrepository;
    }
 
    getMSSQL(){
        return mssql;
    }

    createInstance(){
        try {
            const connect = new mssql.ConnectionPool(config_db);
            return connect;
        } catch (error) {
            console.log('No se logro crear la instancia de DB', error.message);
            return error;
        }
        
    }
    
}

module.exports = BDService;