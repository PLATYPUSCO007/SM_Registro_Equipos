const {createContainer, asClass, asValue, asFunction} = require('awilix');

const config = require('../config');
const app = require('./index');

//Service
const {BDService} = require('../service');

//Controller
const {BDController} = require('../controller')

//Routes
const Routes = require('../route');
const {BDRoutes} = require('../route/index.routes');
//Models

//Repositories

//Config Container

const container = createContainer();

container.register({
    app: asClass(app).singleton(),
    router: asFunction(Routes).singleton(),
    config: asValue(config),
}).register({
    BDService: asClass(BDService).singleton()
}).register({
    BDController: asClass(BDController.bind(BDController)).singleton()
}).register({
    BDRoutes: asFunction(BDRoutes).singleton()
});

module.exports = container;

