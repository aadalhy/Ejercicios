const express = require('express');
const app = express.Router();
const UsuarioModel = require('../../models/usuario/usuario.model');
const RolModel = require('../../models/permiso/rol.model');
const bcrypt = require('bcrypt');
//solo quiero la funcion de verificarAcceso del archivo permisos
const { verificarAcceso } = require('../../middlewares/permisos');
const cargarArchivo = require('../../library/cargarArchivos');

//agregaramos los modelos de los que vamos a ser uso
const EmpresaModel = require('../../models/empresa/empresa.model');

//no se necesitan
// const { application } = require('express');
// const { findByIdAndUpdate, updateOne } = require('../../models/usuario/usuario.model');

//let arrJsnUsuarios=[{ _id:1, strNombre:'Adalhy', strApellido:'Vazquez', strEmail:'adalhy@hotmail.com'}];
//let arrJsnUsuarios=[];

app.get('/', verificarAcceso, async (req,res) => {
    try {
        const _blnEstado = req.query.blnEstado == "false" ? false : true ;
        const obtenerusuarios = await UsuarioModel.find({blnEstado: _blnEstado},{strContrasena:0});
        const obtenerusuariosAgregate = await UsuarioModel.aggregate([
            {$match: {$expr: {$eq: ["$blnEstado", _blnEstado] } }},
            {$lookup: 
                {
                    from: EmpresaModel.collection.name,
                    localField:"idEmpresa",
                    foreignField:"_id",
                    as: "Datos_Empresa"
                }
            },
            {$lookup:
                {
                   from:RolModel.collection.name,
                   let:{idObjRol:'$idObjRol'},
                   pipeline:
                   [
                       {$match:{$expr: {$eq:['$_id','$$idObjRol']}}                       },
                       {$project:
                           {
                               strNombre:1,
                               strDescripcion:1,
                               arrObjIdApis:1
                              
                           }
                       }
                   ],
                   as: "Roles"
                }
            },
            // {$lookup:
            //     {
            //        from:"apis",
            //        let:{arrObjIdApi:'$arrObjIdApis'},
            //        pipeline:
            //        [
            //            //no es necesario en esta consulta
            //            //{$match: {blnEstado:true}},
            //            {$match:
            //                {
            //                    //si permite leer array
            //                    $expr: {$in:['$_id','$$arrObjIdApi']}
            //                }
            //                    //no permite leer array
            //                    //$eq:[]
            //            },
            //            {$project:
            //                {
            //                    strRuta:1,
            //                    strMetodo:1
            //                    //idApis:'$$arrObjIdApi'
            //                }
            //            }
            //        ],
            //        as: "Datos_apis"
            //     }
            // },

            {$project:
                {
                    strNombre:1,
                    strApellido:1,
                    strDireccion:1,
                    strEmail:1,
                    empresa: {
                        $arrayElemAt:['$Datos_Empresa',0]
                    },
                    idObjRol:1,
                    roles: {$arrayElemAt:['$Roles',0]},
                    apis: {$arrayElemAt:['$Datos_apis',0]}
                }
            }
        ]);
        //console.log(obtenerusuarios);

        if(!obtenerusuarios.length>0) 
        {
            return res.status(400).json({
                ok: false,
                msg:'No hay usuarios en la base de datos',
                count: obtenerusuarios.length,
                cont:
                {
                    //obtenerusuarios,
                    obtenerusuariosAgregate
                }
            })
        }

        return res.status(200).json({
            ok: true,
            msg:'Si hay usuarios en la base de datos',
            count: obtenerusuarios.length,
            cont:
            {
                //obtenerusuarios,
                obtenerusuariosAgregate
            }
        })

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
    
});

app.post('/', verificarAcceso, async (req,res) =>
{
    try {
        
        // ? = !_undefined
        // Ternadrio =  existe ? verdadero : si no existe
        const body ={ ...req.body, strContrasena: req.body.strContrasena ? bcrypt.hashSync(req.body.strContrasena,10) : undefined };
        
        //ejemplo de como se encripta 
        //const pwdEncrypt = bcrypt.hashSync(body.strContrasena,10);

        //const obtenerusuario = await UsuarioModel.find({strEmail:body.strEmail, strNombreUsuario:body.strNombreUsuario},{strContrasena:0});
        //retorna un objeto dentro del array
        const obtenerEmail = await UsuarioModel.findOne({strEmail:body.strEmail});
        const obtenerNombreUsuario = await UsuarioModel.findOne({strNombreUsuario:body.strNombreUsuario});

        //Regresa un array de objetos
        //const obtenerEmail = await UsuarioModel.find({strEmail:body.strEmail});
        //const obtenerNombreUsuario = await UsuarioModel.find({strNombreUsuario:body.strNombreUsuario});
        
        //se pueden leer la cantidad de registris q encuentra si no encuantra regresa null, undefined
        //if(obtenerEmail.length>0)

        //este if por que cambiamos a findOne
        if(obtenerEmail)   //regresa true o false
        {
            return res.status(400).json({
                ok:false,
                msg:('El email ya se encuentra registrado'),
                cont:{
                    body
                }
            })
        }

        //if(obtenerNombreUsuario.length>0)
        if(obtenerNombreUsuario)
        {
            return res.status(400).json({
                ok:false,
                msg:('El nombre de usuario ya se encuentra registrado'),
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

        //valido si se envio un archivo
        if(req.files)
        {
            if(!req.files.strImagen)
            {
                return res.status(400).json({
                    ok:false,
                    msg:('No se recibio un archivo strImagen. Favor de ingresarlo'),
                    cont:{
                        
                    }
                })
            }
            //console.log(req.files, 'tiene archivo');
            bodyUsuario.strImagen = await cargarArchivo.subirArchivo(req.files.strImagen,'usuario',['image/png','image/jpg','image/jpeg']);
            //console.log(bodyUsuario.strImagen)
        }

        if (!req.body.idObjRol) 
        {
            const rolDefault =  await RolModel.findOne({blnRolDefault:true});
            //console.log(rolDefault);
            bodyUsuario.idObjRol = rolDefault.id;
        }

        
        const usuarioRegistrado = await bodyUsuario.save();

        return res.status(200).json({
            ok:true,
            msg:('El usuario se registro correctamente'),
            cont:{
                usuarioRegistrado
            }
        })

    } catch (error) {
        //console.log(error);
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

app.put('/', verificarAcceso, async(req,res)=> {

    try {
        const _idUsuario = req.query._idUsuario;

        //validamos que no enviemos in id, o que el id no tenga la longitud correcta
        if (!_idUsuario || _idUsuario.length !=24)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: _idUsuario ? 'El id no es valido, se requiere un id de almenos 24 caracteres' : 'No se recibio un usuario',
                    cont:
                    {
                        _idUsuario
                    }
                }) 
        }

        const encontroUsuario = await UsuarioModel.findOne({_id: _idUsuario, blnEstado:true});
       
        if (!encontroUsuario)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'No se encuentra registrado el usuario',
                    cont:
                    {
                        _idUsuario
                    }
                }) 

        }

        const encontroNombreUsuario = await UsuarioModel.findOne({strNombreUsuario: req.body.strNombreUsuario, _id:{$ne: _idUsuario}},{strNombre:1, strNombreUsuario:1});

        //console.log(encontroNombreUsuario);

        if (encontroNombreUsuario)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'El nombre de usuario ya se encuentra registrado',
                    cont:
                    {
                        encontroNombreUsuario
                    }
                }) 

        }
        

        //tambien se puede utilizar
        //findByIdAndUpdate findOneAndUpdate(_idUsuario, { $set:{strNombre: req.body.strNombre, strApellido: req.body.strApellido, strDireccion: req.body.strDireccion}}, {new :true, upsert: true});
        //updateOne({_id:_idUsuario}, { $set:{strNombre: req.body.strNombre, strApellido: req.body.strApellido, strDireccion: req.body.strDireccion}});
        const actualizarUsuario = await UsuarioModel.findOneAndUpdate({_id:_idUsuario}, 
            { $set:{strNombre: req.body.strNombre, 
                strApellido: req.body.strApellido, 
                strDireccion: req.body.strDireccion, 
                strNombreUsuario: req.body.strNombreUsuario,
                idEmpresa: req.body.idEmpresa}}, 
            {new :true, upsert: true});

        if (!actualizarUsuario)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'No se logro actualizar el usuario',
                    cont:
                    {
                        ...req.body
                    }
                }) 

        }

        return res.status(200).json(
            {
                ok:true,
                msg: 'El usuario se actualizo de manera existosa',
                cont:
                {
                    usuarioAnterior: encontroUsuario,
                    usuarioActual: actualizarUsuario
                }
            })


    } 
    catch (error) {
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

app.delete('/', verificarAcceso, async(req,res)=> {
    try {
        const _idUsuario = req.query._idUsuario;
        //valido el que si manda algo distinto a false, lo hace true
        const _blnEstado = req.query.blnEstado == "false" ? false : true ;
        //validamos que se envie un id, o que el id no tenga la longitud correcta
        if (!_idUsuario || _idUsuario.length !=24)
        {
            return res.status(400).json(
                {
                    ok:false,
                    //utilizamos un operador ternarrio para validar cual de las 2 condiciones es la que se esta cumpliendo
                    msg: _idUsuario ? 'El id no es valido, se requiere un id de almenos 24 caracteres' : 'No se recibio un id',
                    cont:
                    {
                        _idUsuario
                    }
                }) 
        }

        const modificarEstado= await UsuarioModel.findOneAndUpdate({_id: _idUsuario}, {$set: {blnEstado: _blnEstado}},{new:true})        

        if (!modificarEstado)
            {
                return res.status(400).json(
                    {
                        ok:false,
                        msg: 'No se realizo ninguna actividad',
                        cont:
                        {
                            ...req.query
                        }
                    }) 
            }

        return res.status(200).json(
            {
                ok:true,
                msg: _blnEstado == true ? 'Se activo el usuario de manera existosa' : 'El usuario se desactivo de manera exitosa' ,
                cont:
                {
                    modificarEstado
                }
            })


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