const express = require('express');
const app = express.Router();
const path = require('path');
const fs = require('fs');


app.get('/:ruta/:nameImg',(req,res) =>{
    try {
        const ruta =req.params.ruta;
        const nameImg = req.params.nameImg;
        const rutaImg = path.resolve(__dirname,`../../../upload/${ruta}/${nameImg}`);
        const noImg = path.resolve(__dirname,`../../assets/noImagen.png`);

        if(fs.existsSync(rutaImg))
        {
            return res.sendFile(rutaImg);
        }
        else
        {
            return res.sendFile(noImg);
        }


    } catch (error) {
        const err = Error(error);
        return res.status(500).json(
            {
                ok:false,
                msg: 'Error en el servidor',
                cont:
                {
                    error:err.message ? err.message : err.name ? err.name : err
                }
            })
    }
    

})

module.exports = app;
