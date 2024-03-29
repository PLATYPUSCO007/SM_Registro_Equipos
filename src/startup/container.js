const { createContainer, asClass, asValue, asFunction } = require('awilix');

const config = require('../config');
const DbConfig = require('../config/DB.config');
const app = require('./index');

//Service
const { BDService, ADService, AuthService, BaseService, PerifericoService, EquipoService, AsignacionService, MantenimientoService, FileService, DetalleMantService, SistemaOperativoService, FabricanteService, ActividadService, TecnicoService, ModeloService, PDFService} = require('../service');

//Controller
const { BDController, ADController, AuthController, PerifericoController, EquipoController, AsignacionController, MantenimientoController, FileController, SistemaOperativoController, FabricanteController, ActividadController, TecnicoController, ModeloController, PDFController} = require('../controller');

//Routes
const Routes = require('../route');
const { BDRoutes, ADRoutes, AuthRoutes, PerifericoRoutes, EquipoRoutes, AsignacionRoutes, MantenimientoRoutes, FileRoutes, SistemaOperativoRoutes, FabricanteRoutes, ActividadRoutes, TecnicoRoutes, ModeloRoutes, PDFRoutes } = require('../route/index.routes');

//Models
const {PerifericoModel, EquipoModel, AsignacionModel, MantenimientoModel, FileModel, UserModel, DetalleMantModel, SistemaOperativoModel, FabricanteModel, ActividadModel, TecnicoModel, ModeloModel} = require('../model');

//Repositories
const {BDrepository ,AdRepository, BaseRepository, PerifericoRepository, EquipoRepository, AsignacionRepository, MantenimientoRepository, FileRepository, DetalleMantRepository, SistemaOperativoRepository, FabricanteRepository, ActividadRepository, TecnicoRepository, ModeloRepository} = require('../repository');

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
    DetalleMantService: asClass(DetalleMantService).singleton(),
    SistemaOperativoService: asClass(SistemaOperativoService).singleton(),
    FabricanteService: asClass(FabricanteService).singleton(),
    ActividadService: asClass(ActividadService).singleton(),
    TecnicoService: asClass(TecnicoService).singleton(),
    ModeloService: asClass(ModeloService).singleton(),
    PDFService: asClass(PDFService).singleton(),
}).register({
    BDController: asClass(BDController.bind(BDController)).singleton(),
    ADController: asClass(ADController.bind(ADController)).singleton(),
    AuthController: asClass(AuthController.bind(AuthController)).singleton(),
    PerifericoController: asClass(PerifericoController.bind(PerifericoController)).singleton(),
    EquipoController: asClass(EquipoController.bind(EquipoController)).singleton(),
    AsignacionController: asClass(AsignacionController.bind(AsignacionController)).singleton(),
    MantenimientoController: asClass(MantenimientoController.bind(MantenimientoController)).singleton(),
    FileController: asClass(FileController.bind(FileController)).singleton(),
    SistemaOperativoController: asClass(SistemaOperativoController.bind(SistemaOperativoController)).singleton(),
    FabricanteController: asClass(FabricanteController.bind(FabricanteController)).singleton(),
    ActividadController: asClass(ActividadController.bind(ActividadController)).singleton(),
    TecnicoController: asClass(TecnicoController.bind(TecnicoController)).singleton(),
    ModeloController: asClass(ModeloController.bind(ModeloController)).singleton(),
    PDFController: asClass(PDFController.bind(PDFController)).singleton(),
}).register({
    BDRoutes: asFunction(BDRoutes).singleton(),
    ADRoutes: asFunction(ADRoutes).singleton(),
    AuthRoutes: asFunction(AuthRoutes).singleton(),
    PerifericoRoutes: asFunction(PerifericoRoutes).singleton(),
    EquipoRoutes: asFunction(EquipoRoutes).singleton(),
    AsignacionRoutes: asFunction(AsignacionRoutes).singleton(),
    MantenimientoRoutes: asFunction(MantenimientoRoutes).singleton(),
    FileRoutes: asFunction(FileRoutes).singleton(),
    SistemaOperativoRoutes: asFunction(SistemaOperativoRoutes).singleton(),
    FabricanteRoutes: asFunction(FabricanteRoutes).singleton(),
    ActividadRoutes: asFunction(ActividadRoutes).singleton(),
    TecnicoRoutes: asFunction(TecnicoRoutes).singleton(),
    ModeloRoutes: asFunction(ModeloRoutes).singleton(),
    PDFRoutes: asFunction(PDFRoutes).singleton(),
}).register({
    User: asValue(UserModel),
    Periferico: asValue(PerifericoModel),
    Equipo: asValue(EquipoModel),
    Asignacion: asValue(AsignacionModel),
    Mantenimiento: asValue(MantenimientoModel),
    File: asValue(FileModel),
    DetalleMantenimiento: asValue(DetalleMantModel),
    SistemaOperativo: asValue(SistemaOperativoModel),
    Fabricante: asValue(FabricanteModel),
    Actividad: asValue(ActividadModel),
    Tecnico: asValue(TecnicoModel),
    Modelo: asValue(ModeloModel),
}).register({
    BDrepository: asClass(BDrepository).singleton(),
    BaseRepository: asClass(BaseRepository).singleton(),
    AdRepository: asClass(AdRepository).singleton(),
    PerifericoRepository: asClass(PerifericoRepository).singleton(),
    EquipoRepository: asClass(EquipoRepository).singleton(),
    AsignacionRepository: asClass(AsignacionRepository).singleton(),
    MantenimientoRepository: asClass(MantenimientoRepository).singleton(),
    FileRepository: asClass(FileRepository).singleton(),
    DetalleMantRepository: asClass(DetalleMantRepository).singleton(),
    SistemaOperativoRepository: asClass(SistemaOperativoRepository).singleton(),
    FabricanteRepository: asClass(FabricanteRepository).singleton(),
    ActividadRepository: asClass(ActividadRepository).singleton(),
    TecnicoRepository: asClass(TecnicoRepository).singleton(),
    ModeloRepository: asClass(ModeloRepository).singleton(),
});

module.exports = container;

