const { reject } = require("async");
const { ErrorHelper } = require("../helper");
const BaseService = require("./Base.service");
let _asignacionService = null;
let asignacionNew = null;

class AsignacionService extends BaseService {
    #data;

    constructor({AsignacionRepository}){
        super(AsignacionRepository);
        _asignacionService = AsignacionRepository;
        this.asignacionNew = null;
        this.conn = null;
    }

}

module.exports = AsignacionService;