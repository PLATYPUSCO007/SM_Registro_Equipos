const {ObjectModel, Any} = require('objectmodel');

const File = new ObjectModel({
    contenido_archivo: Any,
    id_activo_fijo: String,
    nombre_archivo: String,
    tipo_archivo: String
});

File.create = async function(file){
    return new File(file);
}


module.exports = File;