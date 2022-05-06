const express = require('express');
const app = express.Router();
const UsuarioModel = require('..');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('../../config/config');

app.post('/login', async (req, res) => {

    try {
        const strEmail = req.body.strEmail;
        const strContrasena = req.body.strContrasena;

        if (!strEmail || !strContrasena) {
            return res.status(400).json(
                {
                    ok: false,
                    msg: !strEmail && !strContrasena ? 'No se recibio el email ni el pasword, favor de ingresarlos' :
                        (!strEmail ? 'No se recibio un email, favor de ingresalo' : 'No se recibio el pasword, favor de ingresarlo'),
                    cont: {
                        strEmail,
                        strContrasena
                    }
                })
        }

        const encontroEmail = await UsuarioModel.findOne({ strEmail: strEmail });

        if (!encontroEmail) {
            return res.status(400).json(
                {
                    ok: false,
                    msg: 'El email* o la contraseña son incorrectos, favor de verificarlos',
                    cont: {
                        strEmail,
                        strContrasena
                    }
                })
        }

        const compararcontrasena = bcrypt.compareSync(strContrasena, encontroEmail.strContrasena);

        if (!compararcontrasena) {
            return res.status(400).json(
                {
                    ok: false,
                    msg: 'El email o la contraseña* son incorrectos, favor de verificarlos',
                    cont: {
                        strEmail,
                        strContrasena
                    }
                })
        }

        const token = jwt.sign({ usuario: encontroEmail }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        return res.status(200).json(
            {
                ok: true,
                msg: 'Te logeaste correctamente',
                cont:
                {
                    usuario: encontroEmail,
                    token
                }
            })
    }
    catch (error) {
        const err = Error(error);
        return res.status(500).json(
            {
                ok: false,
                msg: 'Error en el servidor',
                cont:
                {
                    error: err.message ? err.message : err.name ? err.name : err
                }
            })
    }


});

module.exports = app;
