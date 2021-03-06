const mongoose = require("mongoose");

let schemaUsuario = mongoose.Schema({
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
    strApellido:
    {
        type: String,
        required:[true,'No se recibio el apellido. Favor de ingresarlo']
    },
    strDireccion:
    {
        type: String,
        required:[true,'No se recibio la direccion. Favor de ingresarlo']
    },
    strEmail:
    {
        type: String,
        required:[true,'No se recibio email. Favor de ingresarlo']
    },
    strContrasena:
    {
        type: String,
        required:[true,'No se recibio la contrasena. Favor de ingresarlo']
    },
    strNombreUsuario:
    {
        type: String,
        required:[true,'No se recibio el nombre de usuario. Favor de ingresarlo']
    },
    idEmpresa:
    {
        type: mongoose.Types.ObjectId,
        required:[true,'No se recibio el id de la Empresa. Favor de ingresarlo']
    },
    strImagen:
    {
        type: String,
        default: 'default.jpg'
    },
    idObjRol:
    {
        type: mongoose.Types.ObjectId
    }
});

module.exports = mongoose.model('Usuario',schemaUsuario);