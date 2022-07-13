const { ErrorHelper } = require("../helper");
const BaseService = require("./Base.service");
let _modeloService = null;
let modeloNew = null;

class ModeloService extends BaseService {

    constructor({ModeloRepository}){
        super(ModeloRepository);
        _modeloService = ModeloRepository;
        modeloNew = null;
    }

}

module.exports = ModeloService;