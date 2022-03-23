const active_directoy = require("activedirectory");
const config = require("../config");
let config_test = {
  url: "ldap://servimeterssa.com:389",
  baseDN: "dc=servimeterssa,dc=com",
  username: "william.enciso@servimeterssa.com",
  password: "We12345678*",
};
let us = "";
let pas = "";
let ad = new active_directoy(config_test);

module.exports = {
  auth: ad.authenticate,
  memberOf: ad.isUserMemberOf,
};
