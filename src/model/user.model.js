const {ObjectModel} = require('objectmodel');
let newUser = {};

const User = new ObjectModel({
    sn: String,
    displayName: String,
});

User.create = async function (user) {
    return new Promise(resolve =>{
        resolve(newUser = new User(user));
        return;
    });
}

User.getUser = async function() {
    return new Promise(resolve=>{
        resolve(newUser);
        return;
    });
}

module.exports = User;