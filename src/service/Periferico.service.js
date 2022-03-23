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

    async create(periferico){
        try {
            perifericoNew = await _perifericoService.create(periferico);
            return perifericoNew;
        } catch (error) {
            return ErrorHelper.generateError('El modelo no es valido ' + error.message, 301);
        }
    }
}

module.exports = PerifericoService;