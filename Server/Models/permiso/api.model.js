const mongoose = require("mongoose");

let schemaApi = mongoose.Schema({
    blnEstado:
    {
        type: Boolean,
        default: true
    },
    strRuta:
    {
        type: String,
        required:[true,'No se recibio la Ruta. Favor de ingresarla']
    },
    strMetodo:
    {
        type: String,
        required:[true,'No se recibio el metodo. Favor de ingresarlo']
    },
    strDescripcion:
    {
        type: String,
        required:[true,'No se recibio la Descripcion. Favor de ingresarlo']
    },
    blnEsApi:
    {
        type: Boolean,
        default: true
    },
    blnEsMenu:
    {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('api',schemaApi);