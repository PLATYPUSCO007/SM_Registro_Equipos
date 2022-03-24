const { createContainer, asClass, asValue, asFunction } = require('awilix');

const config = require('../config');
const app = require('./index');

//Service
const { BDService, ADService, AuthService, BaseService, PerifericoService, EquipoService, AsignacionService} = require('../service');

//Controller
const { BDController, ADController, AuthController, PerifericoController, EquipoController, AsignacionController} = require('../controller');

//Routes
const Routes = require('../route');
const { BDRoutes, ADRoutes, AuthRoutes, PerifericoRoutes, EquipoRoutes, AsignacionRoutes } = require('../route/index.routes');

//Models
const {UserModel} = require('../model');
const {PerifericoModel, EquipoModel, AsignacionModel} = require('../model');

//Repositories
const {AdRepository, BaseRepository, PerifericoRepository, EquipoRepository, AsignacionRepository} = require('../repository');

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
    EquipoService: asClass(EquipoService).singleton(),
    AsignacionService: asClass(AsignacionService).singleton(),
}).register({
    BDController: asClass(BDController.bind(BDController)).singleton(),
    ADController: asClass(ADController.bind(ADController)).singleton(),
    AuthController: asClass(AuthController.bind(AuthController)).singleton(),
    PerifericoController: asClass(PerifericoController.bind(PerifericoController)).singleton(),
    EquipoController: asClass(EquipoController.bind(EquipoController)).singleton(),
    AsignacionController: asClass(AsignacionController.bind(AsignacionController)).singleton(),
}).register({
    BDRoutes: asFunction(BDRoutes).singleton(),
    ADRoutes: asFunction(ADRoutes).singleton(),
    AuthRoutes: asFunction(AuthRoutes).singleton(),
    PerifericoRoutes: asFunction(PerifericoRoutes).singleton(),
    EquipoRoutes: asFunction(EquipoRoutes).singleton(),
    AsignacionRoutes: asFunction(AsignacionRoutes).singleton(),
}).register({
    User: asValue(UserModel),
    Periferico: asValue(PerifericoModel),
    Equipo: asValue(EquipoModel),
    Asignacion: asValue(AsignacionModel)
}).register({
    BaseRepository: asClass(BaseRepository).singleton(),
    AdRepository: asClass(AdRepository).singleton(),
    PerifericoRepository: asClass(PerifericoRepository).singleton(),
    EquipoRepository: asClass(EquipoRepository).singleton(),
    AsignacionRepository: asClass(AsignacionRepository).singleton()
});

module.exports = container;

