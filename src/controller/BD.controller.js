let _bdService = null;

class BdController{
    
    constructor({BDService}){
        _bdService = BDService;
    }

    index(req, res){
        return res.send(_bdService.createInstance());
    }
}

module.exports = BdController;