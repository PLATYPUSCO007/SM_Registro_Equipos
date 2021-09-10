let _adService = {};
let _ad = {};
let _config = {};

class AdController {

    constructor({ ADService, config }) {
        _adService = ADService;
        _config = config;
    }

    async authAD(req, res, next) {
        try {
            _ad = await _adService.connectAD('william.enciso@servimeterssa.com', 'We12345678*');

            if (_ad) {

                _adService.authenticateAD('william.enciso@servimeterssa.com', 'We12345678*').then(result=>{
                    
                    if (result) {
                        res.status(200).send(result);
                    }
                }).catch(error=>{
                    res.status(500).send({error});
                });  

            }
            
            
        } catch (error) {
            res.status(301).send(error);
        }
    }

    async getUser(req, res, next){
        try {
            _adService.getUser().then(result=>{
                console.log('Result ' + JSON.stringify(result));
                res.status(200).send({result});
            }).catch(error=>{
                res.status(500).send({error});
            });
        } catch (error) {
            res.status(301).send({error});
        }
    }
}

module.exports = AdController;