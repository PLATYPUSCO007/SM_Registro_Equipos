const {sign} = require("jsonwebtoken");
const {TOKEN_SECRET} = require('../config');

module.exports.generateToken = async function (user) {
    console.log('Generando token...');
    return sign({user}, TOKEN_SECRET, {expiresIn: "12h"});
}