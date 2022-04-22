const mongoose = require("mongoose");

let schemaProducto = mongoose.Schema({
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
    nmbPrecio:
    {
        type: Number,
        required:[true,'No se recibio el precio. Favor de ingresarlo']
    }
});

module.exports = mongoose.model('Producto',schemaProducto);