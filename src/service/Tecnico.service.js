const { ErrorHelper } = require("../helper");
const BaseService = require("./Base.service");
let _tecnicoService = null;
let tecnicoNew = null;

class TecnicoService extends BaseService {

    constructor({TecnicoRepository}){
        super(TecnicoRepository);
        _tecnicoService = TecnicoRepository;
        tecnicoNew = null;
    }

}

module.exports = TecnicoService;