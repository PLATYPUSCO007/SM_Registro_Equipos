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

    async create(mantenimiento){
        try {
            mantenimientoNew = await _mantenimientoService.create(mantenimiento);
            return mantenimientoNew;
        } catch (error) {
            return ErrorHelper.generateError('El modelo no es valido ' + error.message, 400);
        }
    }
}

module.exports = MantenimientoService;