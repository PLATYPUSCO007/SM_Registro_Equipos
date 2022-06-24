const { createContainer, asClass, asValue, asFunction } = require('awilix');

const config = require('../config');
const DbConfig = require('../config/DB.config');
const app = require('./index');

//Service
const { BDService, ADService, AuthService, BaseService, PerifericoService, EquipoService, AsignacionService, MantenimientoService, FileService} = require('../service');

//Controller
const { BDController, ADController, AuthController, PerifericoController, EquipoController, AsignacionController, MantenimientoController, FileController} = require('../controller');

//Routes
const Routes = require('../route');
const { BDRoutes, ADRoutes, AuthRoutes, PerifericoRoutes, EquipoRoutes, AsignacionRoutes, MantenimientoRoutes, FileRoutes } = require('../route/index.routes');

//Models
const {PerifericoModel, EquipoModel, AsignacionModel, MantenimientoModel, FileModel, UserModel} = require('../model');

//Repositories
const {BDrepository ,AdRepository, BaseRepository, PerifericoRepository, EquipoRepository, AsignacionRepository, MantenimientoRepository, FileRepository} = require('../repository');

//Config Container
const container = createContainer();

container.register({
    app: asClass(app).singleton(),
    router: asFunction(Routes).singleton(),
    config: asValue(config),
    DbConfig: asClass(DbConfig).singleton(),
}).register({
    BDService: asClass(BDService).singleton(),
    ADService: asClass(ADService).singleton(),
    AuthService: asClass(AuthService).singleton(),
    BaseService: asClass(BaseService).singleton(),
    PerifericoService: asClass(PerifericoService).singleton(),
    EquipoService: asClass(EquipoService).singleton(),
    AsignacionService: asClass(AsignacionService).singleton(),
    MantenimientoService: asClass(MantenimientoService).singleton(),
    FileService: asClass(FileService).singleton(),
}).register({
    BDController: asClass(BDController.bind(BDController)).singleton(),
    ADController: asClass(ADController.bind(ADController)).singleton(),
    AuthController: asClass(AuthController.bind(AuthController)).singleton(),
    PerifericoController: asClass(PerifericoController.bind(PerifericoController)).singleton(),
    EquipoController: asClass(EquipoController.bind(EquipoController)).singleton(),
    AsignacionController: asClass(AsignacionController.bind(AsignacionController)).singleton(),
    MantenimientoController: asClass(MantenimientoController.bind(MantenimientoController)).singleton(),
    FileController: asClass(FileController.bind(FileController)).singleton(),
}).register({
    BDRoutes: asFunction(BDRoutes).singleton(),
    ADRoutes: asFunction(ADRoutes).singleton(),
    AuthRoutes: asFunction(AuthRoutes).singleton(),
    PerifericoRoutes: asFunction(PerifericoRoutes).singleton(),
    EquipoRoutes: asFunction(EquipoRoutes).singleton(),
    AsignacionRoutes: asFunction(AsignacionRoutes).singleton(),
    MantenimientoRoutes: asFunction(MantenimientoRoutes).singleton(),
    FileRoutes: asFunction(FileRoutes).singleton(),
}).register({
    User: asValue(UserModel),
    Periferico: asValue(PerifericoModel),
    Equipo: asValue(EquipoModel),
    Asignacion: asValue(AsignacionModel),
    Mantenimiento: asValue(MantenimientoModel),
    File: asValue(FileModel),
}).register({
    BDrepository: asClass(BDrepository).singleton(),
    BaseRepository: asClass(BaseRepository).singleton(),
    AdRepository: asClass(AdRepository).singleton(),
    PerifericoRepository: asClass(PerifericoRepository).singleton(),
    EquipoRepository: asClass(EquipoRepository).singleton(),
    AsignacionRepository: asClass(AsignacionRepository).singleton(),
    MantenimientoRepository: asClass(MantenimientoRepository).singleton(),
    FileRepository: asClass(FileRepository).singleton(),
});

module.exports = container;

