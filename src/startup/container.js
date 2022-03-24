const { createContainer, asClass, asValue, asFunction } = require('awilix');

const config = require('../config');
const app = require('./index');

//Service
const { BDService, ADService, AuthService, BaseService, PerifericoService, EquipoService, AsignacionService, MantenimientoService} = require('../service');

//Controller
const { BDController, ADController, AuthController, PerifericoController, EquipoController, AsignacionController, MantenimientoController} = require('../controller');

//Routes
const Routes = require('../route');
const { BDRoutes, ADRoutes, AuthRoutes, PerifericoRoutes, EquipoRoutes, AsignacionRoutes, MantenimientoRoutes } = require('../route/index.routes');

//Models
const {UserModel} = require('../model');
const {PerifericoModel, EquipoModel, AsignacionModel, MantenimientoModel} = require('../model');

//Repositories
const {AdRepository, BaseRepository, PerifericoRepository, EquipoRepository, AsignacionRepository, MantenimientoRepository} = require('../repository');

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
    MantenimientoService: asClass(MantenimientoService).singleton(),
}).register({
    BDController: asClass(BDController.bind(BDController)).singleton(),
    ADController: asClass(ADController.bind(ADController)).singleton(),
    AuthController: asClass(AuthController.bind(AuthController)).singleton(),
    PerifericoController: asClass(PerifericoController.bind(PerifericoController)).singleton(),
    EquipoController: asClass(EquipoController.bind(EquipoController)).singleton(),
    AsignacionController: asClass(AsignacionController.bind(AsignacionController)).singleton(),
    MantenimientoController: asClass(MantenimientoController.bind(MantenimientoController)).singleton(),
}).register({
    BDRoutes: asFunction(BDRoutes).singleton(),
    ADRoutes: asFunction(ADRoutes).singleton(),
    AuthRoutes: asFunction(AuthRoutes).singleton(),
    PerifericoRoutes: asFunction(PerifericoRoutes).singleton(),
    EquipoRoutes: asFunction(EquipoRoutes).singleton(),
    AsignacionRoutes: asFunction(AsignacionRoutes).singleton(),
    MantenimientoRoutes: asFunction(MantenimientoRoutes).singleton(),
}).register({
    User: asValue(UserModel),
    Periferico: asValue(PerifericoModel),
    Equipo: asValue(EquipoModel),
    Asignacion: asValue(AsignacionModel),
    Mantenimiento: asValue(MantenimientoModel),
}).register({
    BaseRepository: asClass(BaseRepository).singleton(),
    AdRepository: asClass(AdRepository).singleton(),
    PerifericoRepository: asClass(PerifericoRepository).singleton(),
    EquipoRepository: asClass(EquipoRepository).singleton(),
    AsignacionRepository: asClass(AsignacionRepository).singleton(),
    MantenimientoRepository: asClass(MantenimientoRepository).singleton(),
});

module.exports = container;

