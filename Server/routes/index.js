const express = require('express');
const app = express.Router();

app.use('/usuario',require('./usuarios/usuario'));
app.use('/producto',require('./productos/producto'));

module.exports = app;