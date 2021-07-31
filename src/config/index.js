if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

module.exports = {
    PORT: process.env.PORT,
    SQL_SERVER: process.env.SQL_SERVER,
    APPLICATION_NAME: process.env.APPLICATION_NAME,
    USER_DB: process.env.USER_DB,
    PASS_DB: process.env.PASS_DB,
    DATABASE: process.env.DATABASE,
    INSTANCE_NAME: process.env.INSTANCE_NAME,
    PORT_DB: process.env.PORT_DB
}