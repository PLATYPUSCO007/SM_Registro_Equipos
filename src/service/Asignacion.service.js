const { ErrorHelper } = require("../helper");
const BaseService = require("./Base.service");
let _asignacionService = null;
let asignacionNew = null;

class AsignacionService extends BaseService { 

    constructor({AsignacionRepository}){
        super(AsignacionRepository);
        _asignacionService = AsignacionRepository;
        asignacionNew = null;
    }

    async create(asignacion){
        try {
            asignacionNew = await _asignacionService.create(asignacion);
            return asignacionNew;
        } catch (error) {
            return ErrorHelper.generateError('El modelo no es valido ' + error.message, 400);
        }
    }
}

module.exports = AsignacionService;