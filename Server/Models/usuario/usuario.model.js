const mongoose = require("mongoose");

let schemaUsuario = mongoose.Schema({
    strNombre:
    {
        type: String,
        required:[true,'No se recibio el Nombre. Favor de ingresarlo']
    },
    strApellido:
    {
        type: String,
        required:[true,'No se recibio el apellido. Favor de ingresarlo']
    },
    strEmail:
    {
        type: String,
        required:[true,'No se recibio email. Favor de ingresarlo']
    }
});

module.exports = mongoose.model('Usuario',schemaUsuario);