const express = require('express');
const app = express.Router();

app.use('/usuario',require('./usuarios/usuario'));
app.use('/producto',require('./productos/producto'));
app.use('/empresa',require('./empresa/empresa'));

module.exports = app;