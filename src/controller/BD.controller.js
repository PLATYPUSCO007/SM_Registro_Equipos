let _bdService = null;
let _pool = null;

class BdController {

    constructor({ BDService }) {
        _bdService = BDService;
    }

    // index(req, res) {

    // }

    async getData(req, res) {
        try {
            _pool = await _bdService.createInstance();
            let data = await _pool.request().query("SELECT * FROM asignacion");
            return res.status(300).json(data.recordsets[0][0].identificacion);
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = BdController;