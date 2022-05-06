const express = require('express');
const app = express.Router();
const ApiModel = require('../../models/permiso/api.model');

app.post ('/', async (req,res) => {
    try {
        const body = req.body;
        const bodyApi =  new ApiModel(body);
        const err =bodyApi.validateSync();
        
        if (err)
        {
            return res.status(400).json({
                ok: false,
                msg:'Uno o mas campos no se ingresaron',
                cont:
                {
                    err
                }
            })
        }
    
        if(bodyApi.strMetodo != 'GET' && bodyApi.strMetodo != 'POST' && bodyApi.strMetodo != 'PUT' && bodyApi.strMetodo != 'DELETE')
        {
            return res.status(400).json({
                ok: false,
                msg:'El strMetodo no es valido',
                cont:
                {
                    metodosPermitidos: ['GET','POST','PUT','DELETE']
                }
            })
        }

        const encontroApi = await ApiModel.findOne({strRuta: bodyApi.strRuta, strMetodo: bodyApi.strMetodo},{strRuta:1,strDescripcion:1});

        if (encontroApi)
        {
            return res.status(400).json({
                ok: false,
                msg:'El Api ya se encuentra registrado',
                cont:
                {
                    encontroApi
                }
            })
        }

        const registroApi=await bodyApi.save();
        return res.status(200).json({
            ok: true,
            msg:'El Api se registro de manera existosa',
            cont:
            {
                registroApi
            }
        })
    
    } 
    catch (error) {
        return res.status(500).json(
            {
                ok:false,
                msg: 'Error en el servidor',
                cont:
                {
                    error
                }
            })    
    }
})

module.exports = app;