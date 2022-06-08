class Dbconfig{
    constructor({ config }){
            this.user= config.USER_DB;
            this.password= config.PASS_DB;
            this.server= config.SQL_SERVER;
            this.database= config.DATABASE;
            this.options= {
                trustedconnection: false,
                enableArithAbort: true,
                encrypt: false
                //instancename: INSTANCE_NAME
            };
            this.port = parseInt(config.PORT_DB)
    }
}

module.exports = Dbconfig;