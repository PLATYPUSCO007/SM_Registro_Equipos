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

    async create(equipo){
        try {
            equipoNew = await _equipoService.create(equipo);
            return equipoNew;
        } catch (error) {
            return ErrorHelper.generateError('El modelo no es valido ' + error.message, 400);
        }
    }
}

module.exports = EquipoService;