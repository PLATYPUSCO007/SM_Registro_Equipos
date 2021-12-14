const { createContainer, asClass, asValue, asFunction } = require('awilix');

const config = require('../config');
const app = require('./index');

//Service
const { BDService, ADService, AuthService, BaseService } = require('../service');

//Controller
const { BDController, ADController, AuthController } = require('../controller');

//Routes
const Routes = require('../route');
const { BDRoutes, ADRoutes, AuthRoutes } = require('../route/index.routes');

//Models
const {UserModel} = require('../model');

//Repositories
const {AdRepository, BaseRepository} = require('../repository');

//Config Container
const container = createContainer();

container.register({
    app: asClass(app).singleton(),
    router: asFunction(Routes).singleton(),
    config: asValue(config),
}).register({
    BDService: asClass(BDService).singleton(),
    ADService: asClass(ADService).singleton(),
    AuthService: asClass(AuthService).singleton(),
    BaseService: asClass(BaseService).singleton(),
}).register({
    BDController: asClass(BDController.bind(BDController)).singleton(),
    ADController: asClass(ADController.bind(ADController)).singleton(),
    AuthController: asClass(AuthController.bind(AuthController)).singleton()
}).register({
    BDRoutes: asFunction(BDRoutes).singleton(),
    ADRoutes: asFunction(ADRoutes).singleton(),
    AuthRoutes: asFunction(AuthRoutes).singleton()
}).register({
    User: asValue(UserModel)
}).register({
    BaseRepository: asClass(BaseRepository).singleton(),
    AdRepository: asClass(AdRepository).singleton()
});

module.exports = container;

