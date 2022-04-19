const express = require('express');
const app = express.Router();

//let arrJsnUsuarios=[{ _id:1, strNombre:'Adalhy', strApellido:'Vazquez', strEmail:'adalhy@hotmail.com'}];
let arrJsnUsuarios=[];

/*ejmeplo de desclaracion de variables
let arrUsuarios;
let strNombre;
let nmbCantidad;
let jsnNombreCompleto;
let blnEstado;
let datFecha;*/

//Ejemplo para descargar archivo
//const path = require('path');
//const rutadescarga=path.resolve (__dirname,'../../assets/index.html');

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

module.exports = app;