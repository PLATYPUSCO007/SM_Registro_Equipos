const { ErrorHelper } = require("../helper");
const BaseService = require("./Base.service");
let _mantenimientoService = null;
let mantenimientoNew = null;

class MantenimientoService extends BaseService { 

    constructor({MantenimientoRepository}){
        super(MantenimientoRepository);
        _mantenimientoService = MantenimientoRepository;
        mantenimientoNew = null;
    }

}

module.exports = MantenimientoService; 