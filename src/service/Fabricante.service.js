const { ErrorHelper } = require("../helper");
const BaseService = require("./Base.service");
let _fabricanteService = null;
let fabricanteNew = null;

class FabricanteService extends BaseService {

    constructor({FabricanteRepository}){
        super(FabricanteRepository);
        _fabricanteService = FabricanteRepository;
        fabricanteNew = null;
    }

}

module.exports = FabricanteService;