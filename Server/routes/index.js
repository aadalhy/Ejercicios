const express = require('express');
const app = express.Router();

app.use('/usuario',require('./usuarios/usuario'));

module.exports = app;