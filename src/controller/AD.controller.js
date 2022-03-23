let _adService = {};
let _ad = {};
let _config = {};

class AdController {

    constructor({ ADService, config }) {
        _adService = ADService;
        _config = config;
    }

}

module.exports = AdController;