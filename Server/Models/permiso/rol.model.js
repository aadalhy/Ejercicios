const mongoose = require("mongoose");

let schemaRol = mongoose.Schema({
    strNombre:
    {
        type: String,
        required:[true,'No se recibio el Nombre. Favor de ingresarlo']
    },
    strDescripcion:
    {
        type: String,
        required:[true,'No se recibio la Descripcion. Favor de ingresarlo']
    },
    arrObIjdApis: [],
    blnRolDefault:
    {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('api',schemaRol);