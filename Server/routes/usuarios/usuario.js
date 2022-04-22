const express = require('express');
const app = express.Router();
const UsuarioModel = require('../../models/usuario/usuario.model');
const bcrypt = require('bcrypt');

//let arrJsnUsuarios=[{ _id:1, strNombre:'Adalhy', strApellido:'Vazquez', strEmail:'adalhy@hotmail.com'}];
//let arrJsnUsuarios=[];

app.get('/', async (req,res) => {

    const obtenerusuarios = await UsuarioModel.find();

    //console.log(obtenerusuarios);

    if(!obtenerusuarios.length>0) 
    {
        return res.status(400).json({
            ok: false,
            msg:'No hay usuarios en la base de datos',
            cont:
            {
                obtenerusuarios
            }
        })
    }

    return res.status(200).json({
        ok: true,
        msg:'Si hay usuarios en la base de datos',
        count: obtenerusuarios.length,
        cont:
        {
            obtenerusuarios
        }
    })
});

app.post('/', async (req,res) =>
{
    // ? = !_undefined
    // Ternadrio =  existe ? verdadero : si no existe
    const body ={ ...req.body, strContrasena: req.body.strContrasena ? bcrypt.hashSync(req.body.strContrasena,10) : undefined };
    
    //ejemplo de como se encripta 
    //const pwdEncrypt = bcrypt.hashSync(body.strContrasena,10);

    const obtenerusuario = await UsuarioModel.find({strEmail:body.strEmail});


    if(obtenerusuario.length>0)
    {
        return res.status(400).json({
            ok:false,
            msg:('El email ya se encuentra registrado'),
            cont:{
                body
            }
        })
    }

    const bodyUsuario = new UsuarioModel(body);
    const err = bodyUsuario.validateSync();

    if (err) 
    {
        return res.status(400).json({
            ok:false,
            msg:('Falta uno o mas datos del usuario. Favor de completarlos'),
            cont:{
                err
            }
        })
    }

    const usuarioRegistrado = await bodyUsuario.save();

    return res.status(200).json({
        ok:true,
        msg:('El usuario se registro correctamente'),
        cont:{
            usuarioRegistrado
        }
    })

})


/*
app.get('/',(req,res)=>
{
    const arrUsuarios= arrJsnUsuarios;

    if(arrUsuarios.length>0) 
    {
        return res.status(200).json({
            ok: true,
            msg:'Se recibieron los usuarios correctamente',
            cont:
            {
                arrUsuarios
            }
        })
    }
    else
    {
        return res.status(400).json({
            ok: false,
            msg:'No se encontraron usuarios',
            cont:
            {
                arrUsuarios
            }
        })
    }

    
    
        //ejemplo de otra forma de enviar una respuesta
        //return res.status(300).send('<h5>Hola soy Alejandro</h5>')
       // return res.download(rutadescarga,'document.html');
    
})

app.get('/obtenerusuario',(req,res)=>
{
    const _idUsuario = Number(req.query._idUsuario);

    if(!_idUsuario)
    {
        return res.status(400).json
            ({
                ok:false,
                msg:'El usuario no es valido',
                cont:
                {
                    _idUsuario
                }
            })
    }

    const encuentra = arrJsnUsuarios.find(usuario => usuario._id === _idUsuario);

    if(!encuentra)
    {
        return res.status(400).json(
            {
                ok:false,
                msg: 'El usuario no existe',
                cont:
                {
                    _idUsuario
                }
            })
    }
    
    return res.status(200).json(
        {
            ok:true,
            msg: 'El usuario si existe',
            cont:
            {
                encuentra
            }
        })   
    
})

app.post('/',(req,res) =>
{
    //const strNombre=req.body.strNombre;
    //const strApellido=req.body.strApellido;
    //const strEmail = req.body.strEmail;
    //const _id = req.body._id;


    //para asignar valores a un array
    const  body=
    {
        strNombre: req.body.strNombre,
        strApellido: req.body.strApellido,
        strEmail: req.body.strEmail,
        _id: Number(req.body._id)
    }

    //valido que no esten indefinidos
    if (body._id && body.strNombre && body.strApellido && body.strEmail)
    {
        const encuentra=arrJsnUsuarios.find(usuario => usuario._id==body._id || usuario.strEmail == body.strEmail)

        if(encuentra)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'El id del usuario ya existe',
                    cont:
                    {
                        encuentra
                    }
                })
        }
        else
        {
            arrJsnUsuarios.push(body);
        }
    }
    else
    {
        return res.status(400).json(
            {
                ok:false,
                msg: 'No se enviaron todos los parametros',
                cont:
                {
                    body
                }
            })
    }


    //const usuarioreg = arrJsnUsuarios.push(body); regresa la cantidad de registros
    
    //arrJsnUsuarios.push(body);

    console.log(body);
    console.log(arrJsnUsuarios);

    res.status(200).json(
        {
            ok:true,
            msg: 'Se registro el usuario',
            cont:
            {
                arrJsnUsuarios
            }
        })
        
    

    //const strNombre ={ strNombre: req.body.strNombre};
    //const strApellido ={ strApellido: req.body.strApellido};
    //console.log(strNombre,strApellido,strEmail,_id,'Entro por body');

})


app.put('/',(req,res) =>
{
    const _idUsuario = parseInt(req.query._idUsuario);
    
    if(_idUsuario)
    {
        const encontro = arrJsnUsuarios.find(usuario => usuario._id === _idUsuario);
        if (encontro)
        {
            
            const actualizar = {_id:_idUsuario, strNombre:req.body.strNombre, strApellido:req.body.strApellido, strEmail:req.body.strEmail }
            //console.log(nuevo);
            const filtrarusuario = arrJsnUsuarios.filter(usuario=> usuario._id != _idUsuario);
            //console.log(filtrarusuario);
            arrJsnUsuarios = filtrarusuario;

            arrJsnUsuarios.push(actualizar);

            return res.status(200).json
            ({
                ok:true,
                msg:`El usuario con el id: ${_idUsuario} se actualizo de manera exitosa`,
                cont:
                {
                   actualizar
                }
            }) 
        }
        else
        {
            return res.status(400).json
            ({
                ok:false,
                msg:`El usuario con el id: ${_idUsuario} no se encuentra registrado.`,
                cont:
                {
                    _idUsuario
                }
            }) 
        }
    }
    else
    {
        return res.status(400).json
            ({
                ok:false,
                msg:'El usuario no existe',
                cont:
                {
                    _idUsuario
                }
            })

        
    }

})

app.delete('/',(req,res) =>
{
    const _idUsuarioD = parseInt(req.query._idUsuarioD);

    if(_idUsuarioD)
    {
        const encontro = arrJsnUsuarios.find(usuario => usuario._id === _idUsuarioD);
        if (encontro)
        {
            
            const eliminar = {_id:_idUsuarioD, strNombre:req.body.strNombre, strApellido:req.body.strApellido, strEmail:req.body.strEmail }
            //console.log(nuevo);
            const filtrarusuario = arrJsnUsuarios.filter(usuario=> usuario._id != _idUsuarioD);
            //console.log(filtrarusuario);
            arrJsnUsuarios = filtrarusuario;

            //arrJsnUsuarios.push(actualizar);

            
            return res.status(200).json
            ({
                ok:true,
                msg:`El usuario con el id: ${_idUsuarioD} se elimino de manera exitosa`,
                cont:
                {
                   eliminar
                }
            }) 
        }
        else
        {
            return res.status(400).json
            ({
                ok:false,
                msg:`El usuario con el id: ${_idUsuarioD} no se encuentra registrado.`,
                cont:
                {
                    _idUsuarioD
                }
            }) 
        }
    }
    else
    {
        return res.status(400).json
            ({
                ok:false,
                msg:'El usuario no existe',
                cont:
                {
                    _idUsuarioD
                }
            })

        
    }
})
*/
module.exports = app;