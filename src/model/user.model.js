const {ObjectModel} = require('objectmodel');
newUser = {};

const User = new ObjectModel({
    sn: String,
    displayName: String,
});

User.create = async function (newUser) {
    return new Promise(resolve =>{
        resolve(this.newUser = new User(newUser));
    });
}

User.getUser = async function() {
    return new Promise(resolve=>{
        resolve(this.newUser);
    });
}

module.exports = User;