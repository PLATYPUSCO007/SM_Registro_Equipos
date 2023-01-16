if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  console.log('Estoy en DEV', require("dotenv").config());
}

module.exports = {
  PORT: process.env.PORT,
  SQL_SERVER: process.env.SQL_SERVER,
  APPLICATION_NAME: process.env.APPLICATION_NAME,
  USER_DB: process.env.USER_DB,
  PASS_DB: process.env.PASS_DB,
  DATABASE: process.env.DATABASE,
  INSTANCE_NAME: process.env.INSTANCE_NAME,
  PORT_DB: process.env.PORT_DB,
  LDAP: process.env.LDAP,
  DN: process.env.DN,
  USER_AD: process.env.USER_AD,
  PASS_AD: process.env.PASS_AD,
  GROUPNAME: process.env.GROUPNAME,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
};
