const { ErrorHelper } = require("../helper");
const BaseService = require("./Base.service");
let _sistemaOperativoService = null;
let sistemaOperativoNew = null;

class SistemaOperativoService extends BaseService {

    constructor({SistemaOperativoRepository}){
        super(SistemaOperativoRepository);
        _sistemaOperativoService = SistemaOperativoRepository;
        sistemaOperativoNew = null;
    }

}

module.exports = SistemaOperativoService;