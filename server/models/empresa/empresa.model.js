const mongoose = require("mongoose");

let schemaEmpresa = mongoose.Schema({
    blnEstado:
    {
        type: Boolean,
        default: true
    },
    strNombre:
    {
        type: String,
        required:[true,'No se recibio el Nombre. Favor de ingresarlo']
    },
    strDescripcion:
    {
        type: String,
        required:[true,'No se recibio la descripcion. Favor de ingresarla']
    },
    nmbTelefono:
    {
        type: Number,
        required:[true,'No se recibio el telefono. Favor de ingresarlo']
    },
    nmbCodigoPostal:
    {
        type: Number,
        required:[true,'No se recibio el codigopostal. Favor de ingresarlo']
    },
    strCiudad:
    {
        type: String,
        required:[true,'No se recibio la ciudad. Favor de ingresarla']
    }
});

module.exports = mongoose.model('Empresa',schemaEmpresa);