const { ErrorHelper } = require("../helper");
const BaseService = require("./Base.service");
let _equipoService = null;
let equipoNew = null;

class EquipoService extends BaseService { 

    constructor({EquipoRepository}){
        super(EquipoRepository);
        _equipoService = EquipoRepository;
        equipoNew = null;
    }

}

module.exports = EquipoService;