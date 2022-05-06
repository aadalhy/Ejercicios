const express = require('express');
const app = express.Router();

app.use('/auth',require('./auth/login'));
app.use('/usuario',require('./usuarios/usuario'));
app.use('/producto',require('./productos/producto'));
app.use('/empresa',require('./empresa/empresa'));
app.use('/permiso/api',require('./permiso/api'));
app.use('/permiso/rol', require('./permiso/rol'));
app.use('/imagen',require('./imagen/imagen'));

module.exports = app;