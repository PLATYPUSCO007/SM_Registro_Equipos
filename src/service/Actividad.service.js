const { ErrorHelper } = require("../helper");
const BaseService = require("./Base.service");
let _actividadService = null;
let actividadNew = null;

class ActividadService extends BaseService {

    constructor({ActividadRepository}){
        super(ActividadRepository);
        _actividadService = ActividadRepository;
        actividadNew = null;
    }

}

module.exports = ActividadService;