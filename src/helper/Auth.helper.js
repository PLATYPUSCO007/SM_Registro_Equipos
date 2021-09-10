const {sign} = require("jsonwebtoken");
const {TOKEN_SECRET} = require('../config');

module.exports.generateToken = function (user) {
    return sign(user, TOKEN_SECRET, {expiresIn: "2h"});
}