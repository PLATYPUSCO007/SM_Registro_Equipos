const { createContainer, asClass, asValue, asFunction } = require('awilix');

const config = require('../config');
const app = require('./index');

//Service
const { BDService, ADService, AuthService, BaseService, PerifericoService} = require('../service');

//Controller
const { BDController, ADController, AuthController, PerifericoController } = require('../controller');

//Routes
const Routes = require('../route');
const { BDRoutes, ADRoutes, AuthRoutes, PerifericoRoutes } = require('../route/index.routes');

//Models
const {UserModel} = require('../model');
const {PerifericoModel} = require('../model');

//Repositories
const {AdRepository, BaseRepository, PerifericoRepository} = require('../repository');

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
    PerifericoService: asClass(PerifericoService).singleton(),
}).register({
    BDController: asClass(BDController.bind(BDController)).singleton(),
    ADController: asClass(ADController.bind(ADController)).singleton(),
    AuthController: asClass(AuthController.bind(AuthController)).singleton(),
    PerifericoController: asClass(PerifericoController.bind(PerifericoController)).singleton(),
}).register({
    BDRoutes: asFunction(BDRoutes).singleton(),
    ADRoutes: asFunction(ADRoutes).singleton(),
    AuthRoutes: asFunction(AuthRoutes).singleton(),
    PerifericoRoutes: asFunction(PerifericoRoutes).singleton(),
}).register({
    User: asValue(UserModel),
    Periferico: asValue(PerifericoModel)
}).register({
    BaseRepository: asClass(BaseRepository).singleton(),
    AdRepository: asClass(AdRepository).singleton(),
    PerifericoRepository: asClass(PerifericoRepository).singleton()
});

module.exports = container;

