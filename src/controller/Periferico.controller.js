let _bdService = null;
let _perifericoService = null;
let _pool = null;
let sql = null;

class PerifericoController {

    constructor({ BDService, PerifericoService}) {
        _bdService = BDService;
        _perifericoService = PerifericoService;
        sql = _bdService.getMSSQL();
    }

    async insertPeriferico(req, res) {

        try {
            if(req.body.tipo && req.body.activo != null && req.body.fecha_asignacion != null && req.body.fecha_retiro != null && req.body.motivo_retiro != null && req.body.id_equipo != null){

                let {tipo, activo, fecha_asignacion, fecha_retiro, motivo_retiro, id_equipo} = req.body;

                fecha_asignacion = new Date(fecha_asignacion);
                fecha_retiro = new Date(fecha_retiro);

                let periferico = {
                    tipo,
                    activo,
                    fecha_asignacion,
                    fecha_retiro,
                    motivo_retiro,
                    id_equipo
                }

                let Objectperiferico = await _perifericoService.create(periferico);
                
                if (!Objectperiferico.message) {
                    
                    _pool = _bdService.createInstance();

                    _pool.connect()
                        .then(async (pool)=>{
                            console.log('Conectado a MSSQL');
                            try {
                                const data = await pool.request()
                                .input('tipo', sql.NVarChar, Objectperiferico.tipo)
                                .input('activo', sql.NVarChar, Objectperiferico.activo)
                                .input('fecha_asignacion', sql.DateTime, Objectperiferico.fecha_asignacion)
                                .input('fecha_retiro', sql.DateTime, Objectperiferico.fecha_retiro)
                                .input('motivo_retiro', sql.NVarChar, Objectperiferico.motivo_retiro)
                                .input('id_equipo', sql.Int, Objectperiferico.id_equipo)
                                .query("INSERT INTO [dbo].[perifericos] (tipo,activo,fecha_asignacion,fecha_retiro,motivo_retiro,id_equipo) VALUES (@tipo,@activo,@fecha_asignacion,@fecha_retiro,@motivo_retiro,@id_equipo)")
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

    async deletePeriferico(req, res) {
        try{
            if(req.body.id != null){
                let {id} = req.body;
                _pool = _bdService.createInstance();
                _pool.connect()
                    .then(async (pool)=>{
                        console.log('Conectado a MSSQL');
                        try {
                            const data = await pool.request()
                            .input('id_periferico', sql.Int, id)
                            .query("DELETE FROM [dbo].[perifericos] WHERE id_periferico = @id_periferico")
                            res.status(200).json(data);
                        } catch (error) {
                            console.log('No se pudo eliminar el registro. ', error.message);
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
                res.status(405).send('Error del cliente, Id no enviado');
            }
        }catch(error){
            console.log(error.message);
            res.status(500).send(error.message);
        }
    }

    async updatePeriferico(req, res) {
        try {

            if(req.body.id != null && req.body.tipo && req.body.activo != null && req.body.fecha_asignacion != null && req.body.fecha_retiro != null && req.body.motivo_retiro != null && req.body.id_equipo != null){

                let {id, tipo, activo, fecha_asignacion, fecha_retiro, motivo_retiro, id_equipo} = req.body;

                fecha_asignacion = new Date(fecha_asignacion);
                fecha_retiro = new Date(fecha_retiro);

                let periferico = {
                    tipo,
                    activo,
                    fecha_asignacion,
                    fecha_retiro,
                    motivo_retiro,
                    id_equipo
                }

                let Objectperiferico = await _perifericoService.create(periferico);
                
                if (!Objectperiferico.message) {
                    
                    _pool = _bdService.createInstance();

                    _pool.connect()
                        .then(async (pool)=>{
                            console.log('Conectado a MSSQL');
                            try {
                                const data = await pool.request()
                                .input('id_periferico', sql.Int, id)
                                .input('tipo', sql.NVarChar, Objectperiferico.tipo)
                                .input('activo', sql.NVarChar, Objectperiferico.activo)
                                .input('fecha_asignacion', sql.DateTime, Objectperiferico.fecha_asignacion)
                                .input('fecha_retiro', sql.DateTime, Objectperiferico.fecha_retiro)
                                .input('motivo_retiro', sql.NVarChar, Objectperiferico.motivo_retiro)
                                .input('id_equipo', sql.Int, Objectperiferico.id_equipo)
                                .query("UPDATE [dbo].[perifericos] SET tipo = @tipo, activo = @activo, fecha_asignacion = @fecha_asignacion, fecha_retiro = @fecha_retiro, motivo_retiro = @motivo_retiro, id_equipo = @id_equipo WHERE id_periferico = @id_periferico")
                                res.status(200).json(data);
                            } catch (error) {
                                console.log('No se pudo actualizar el registro. ', error.message);
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

    async getPerifericos(req, res) {
        try {

            _pool = _bdService.createInstance();

            _pool.connect()
                .then(async (pool)=>{
                    console.log('Conectado a MSSQL');
                    try {
                        const data = await pool.request()
                        .query("SELECT * FROM [dbo].[perifericos]")
                        res.status(200).json(data);
                    } catch (error) {
                        console.log('No se pudo encontrar los registros. ', error.message);
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
            
        }  catch (error) {
            console.log(error.message);
            res.status(500).send(error.message);
        }
    }

    async getPerifericosById(req, res) {
        try {

            if(req.params.id != null){
                let {id} = req.params;

                _pool = _bdService.createInstance();

                _pool.connect()
                    .then(async (pool)=>{
                        console.log('Conectado a MSSQL');
                        try {
                            const data = await pool.request()
                            .input('id_periferico', sql.Int, id)
                            .query("SELECT * FROM [dbo].[perifericos] WHERE id_periferico = @id_periferico")
                            res.status(200).json(data.recordsets);
                        } catch (error) {
                            console.log('No se pudo encontrar el registro. ', error.message);
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
                res.status(500).send('El id no se envio!');
            }
            
        }  catch (error) {
            console.log(error.message);
            res.status(500).send(error.message);
        }
    }

    async getPerifericosByIdEquipo(req, res) {
        try {

            if(req.params.equipo != null){
                let {equipo} = req.params;

                _pool = _bdService.createInstance();

                _pool.connect()
                    .then(async (pool)=>{
                        console.log('Conectado a MSSQL');
                        try {
                            const data = await pool.request()
                            .input('id_equipo', sql.Int, equipo)
                            .query("SELECT * FROM [dbo].[perifericos] WHERE id_equipo = @id_equipo")
                            res.status(200).json(data.recordsets);
                        } catch (error) {
                            console.log('No se pudo encontrar el registro. ', error.message);
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
                res.status(500).send('El id no se envio!');
            }
            
        }  catch (error) {
            console.log(error.message);
            res.status(500).send(error.message);
        }
    }
}

module.exports = PerifericoController;