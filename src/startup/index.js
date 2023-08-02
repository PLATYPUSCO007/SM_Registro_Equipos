const express = require('express');
const path = require('path');

let _express = null;
let _config = null;

class App{
    constructor({router, config}){
        _config = config;
        _express = express().use(router);
        _express.use(express.static(path.join(__dirname, '../temp/')));
        _express.use(express.static(path.join(__dirname, '../../public/')));
    }

    start(){
        return new Promise(resolve =>{
            _express.listen(_config.PORT, ()=>{
                console.log(_config.APPLICATION_NAME + ' API running on PORT ' + _config.PORT);
                resolve();
            })
        });
    }
}

module.exports = App;

