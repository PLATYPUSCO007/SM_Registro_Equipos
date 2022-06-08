const { ErrorHelper } = require("../helper");
const BaseService = require("./Base.service");
let _perifericoService = null;
let perifericoNew = null;

class PerifericoService extends BaseService {

    constructor({PerifericoRepository}){
        super(PerifericoRepository);
        _perifericoService = PerifericoRepository;
        perifericoNew = null;
    }

}

module.exports = PerifericoService;