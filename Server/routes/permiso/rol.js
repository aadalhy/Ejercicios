const express = require('express');
const app = express.Router();
const RolModel = require('../../Models/permiso/rol.model');

app.get('/', async (req,res) => {
     
     const obtenerRol = await RolModel.find();
     const obtenerRolAgregate = await RolModel.aggregate([
        {$lookup: 
            {
                from:"apis",
                localField:"arrObjIdApis",
                foreignField:"_id",
                as: "Datos_Apis"
            }
        }
     ])
  
     if(!obtenerRol.length>0) 
        {
            return res.status(400).json({
                ok: false,
                msg:'No hay roles en la base de datos',
                count: obtenerRol.length,
                cont:
                {
                    obtenerRolAgregate
                }
            })
        }

        return res.status(200).json({
            ok: true,
            msg:'Si hay usuarios en la base de datos',
            count: obtenerRol.length,
            cont:
            {
                obtenerRolAgregate
            }
        })
})

app.post ('/', async (req,res) => {
    try {
        const body = req.body;
        const bodyRol =  new RolModel(body);
        const err =bodyRol.validateSync();  

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
        
        if(!body.arrObjIdApis)
        {
            return res.status(400).json({
                ok: false,
                msg:'Uno o mas campos no se ingresaron',
                cont:
                {
                    arrObjIdApis:null
                }
            })
        }
       

        const encontroRol = await RolModel.findOne({strNombre:bodyRol.strNombre},{strNombre:1}) 
        if(encontroRol)
        {
            return res.status(400).json({
                ok: false,
                msg:'El rol ya se encuentra registrado',
                cont:
                {
                    encontroRol
                }
            })
        }

        const registroRol = await bodyRol.save();
        return res.status(200).json({
            ok: true,
            msg:'El Api se registro de manera existosa',
            cont:
            {
                registroRol
            }
        })
    } 
    catch (error) {
        console.log(error);
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