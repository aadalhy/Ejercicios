const { type } = require("express/lib/response");
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
    blnRolDefault:
    {
        type: Boolean,
        default: false
    },
    blnEstado:
    {
        type: Boolean,
        default: true
    },
    arrObjIdApis:[mongoose.Types.ObjectId]
})

module.exports = mongoose.model('rol',schemaRol);