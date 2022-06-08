const {ObjectModel} = require('objectmodel');

const Periferico = new ObjectModel({
    activo: String,
    fecha_asignacion: Date,
    fecha_retiro: Date,
    id_activo_fijo: String,
    motivo_retiro: String,
    tipo: String
});

Periferico.create = async function(periferico){
    return new Periferico(periferico);
}

// async function(periferico){
//     return new Promise(resolve =>{
//         resolve(this.periferico = new Periferico({
//             tipo: periferico.tipo,
//             activo: periferico.activo,
//             fecha_asignacion: periferico.fecha_asignacion,
//             fecha_retiro: periferico.fecha_retiro,
//             motivo_retiro: periferico.motivo_retiro,
//             id_equipo: periferico.id_equipo
//         }));
//     });
// }

module.exports = Periferico;