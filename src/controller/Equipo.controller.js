let _bdService = null;
let _equipoService = null;
let _pool = null;
let sql = null;

class EquipoController {

    constructor({ BDService, EquipoService}) {
        _bdService = BDService;
        _equipoService = EquipoService;
        sql = _bdService.getMSSQL();
    }

    async createEquipo(req, res){
        try {
            if (req.body.id_activo_fijo != null && req.body.tipo != null && req.body.fecha_compra != null && req.body.fecha_baja != null && req.body.estado != null && req.body.tipo_propiedad != null) {
                let {id_activo_fijo, tipo, fecha_compra, fecha_baja, estado, tipo_propiedad} = req.body;

                let equipo = {
                    id_activo_fijo,
                    tipo,
                    fecha_compra,
                    fecha_baja,
                    estado,
                    tipo_propiedad                
                }

                let objectEquipo = await _equipoService.create(equipo);

                if (!objectEquipo.message) {
                    _pool = _bdService.createInstance();

                    _pool.connect()
                        .then(async (pool)=>{
                            console.log('Conectado a MSSQL');
                            try {
                                const data = await pool.request()
                                .input('id_activo_fijo', sql.NVarChar, objectEquipo.id_activo_fijo)
                                .input('tipo', sql.NVarChar, objectEquipo.tipo)
                                .input('fecha_compra', sql.DateTime, objectEquipo.fecha_compra)
                                .input('fecha_baja', sql.DateTime, objectEquipo.fecha_baja)
                                .input('estado', sql.NVarChar, objectEquipo.estado)
                                .input('tipo_propiedad', sql.NVarChar, objectEquipo.tipo_propiedad)
                                .query("INSERT INTO [dbo].[equipo] (id_activo_fijo,tipo,fecha_compra,fecha_baja,estado,tipo_propiedad) VALUES (@id_activo_fijo,@tipo,@fecha_compra,@fecha_baja,@estado,@tipo_propiedad)")
                                res.status(200).json(data);
                            } catch (error) {
                                console.log('No se pudo guardar el registro. ', error.message);
                                res.status(500).send(error);
                            }
                        })
                        .catch(error=>{
                            console.log('Connect Database Failed', error.message);
                            res.status(500).send(error);
                        })
                        .finally(()=>{
                            _pool.close();
                        });
                }else{
                    res.status(400).send('Error en el servidor ' + Objectperiferico.message);
                }
            }else{
                res.status(500).send('El objeto no esta completo');
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).send(error.message);
        }
    }
}

module.exports = EquipoController;