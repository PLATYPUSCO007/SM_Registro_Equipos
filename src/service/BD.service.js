let config_db = {};
const mssql = require('mssql');

class BDService {

    constructor({ config }) {
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
    }

    async createInstance() {
        try {
            let pool = await mssql.connect(config_db);
            if (!pool) {
                throw new Error('No se logro conectar');
            }
            return pool;
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = BDService;