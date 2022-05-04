const jwt = require('jsonwebtoken');
require('../config/config');
const UsuarioModel = require('../models/usuario/usuario.model');
const RolModel = require('../models/permiso/rol.model');
const ApiModel = require('../models/permiso/api.model');
const ObjectId = require('mongoose').Types.ObjectId;

const verificarAcceso = async (req , res, next) => {
    try {
        //console.log('estoy en el middleware');
        const token = req.get('token');
        const ruta =  req.originalUrl.split('?');
        const rutaorigen = ruta[0];
        const originalMetodo = req.method;

        if(!token)
        {
            console.log("No se permitio el acceso a la ruta: ",(rutaorigen).red);
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'No se recibio un token valido',
                    cont:
                    {
                        token
                    }
                })
        }

        jwt.verify(token, process.env.SEED, async (err, decoded) => {
            if(err)
            {
               //console.log(err.name);
               console.log("No se permitio el acceso a la ruta: ",(rutaorigen).red); 
               return res.status(400).json(
                {
                    ok:false,
                    msg: err.name == "JsonWebTokenError" ? 'EL token no es valido': 'El token expiro',
                    cont:
                    {
                        token
                    }
                })
            }
            
            //console.log(decoded);
            //console.log("Se permitio el acceso a la ruta: " ,(rutaorigen).green);

            if(!decoded.usuario._id)
            {
                return res.status(500).json(
                    {
                        ok:false,
                        msg: 'No se recibio el identificador del usuario',
                        cont:
                        {
                            usuario: decoded.usuario
                        }
                    })
            }

            //agregatr siempre regresa un array
            // si solo se trae un objeto del array (destructurar) ponerlo asi const [obtenerusuariosAgregate] = await UsuarioModel.aggregate([
            // si quieres el array
            const [obtenerusuariosAgregate] = await UsuarioModel.aggregate([
                //{}
                {$match: {blnEstado: true}},
                {$match: {_id: ObjectId(decoded.usuario._id)}},

                {$lookup:
                    {
                       from:RolModel.collection.name,
                       let:{idObjRol:'$idObjRol'},
                       pipeline:
                       [
                           {$match:{$expr: {$eq:['$_id','$$idObjRol']}}},
                           {$lookup:
                                {
                                    from: ApiModel.collection.name,
                                    let:{arrObjIdApi:'$arrObjIdApis'},
                                    pipeline:
                                    [
                                        {$match:{ $expr: {$in:['$_id','$$arrObjIdApi']}}},
                                        {$project:
                                            {
                                                _id:0,
                                                strRuta:1,
                                                strMetodo:1
                                            }
        
                                        }
                                    ],
                                    as: 'Datos_apis'
                                }
                           },
                           {$project:
                               {
                                   _id:0,
                                   strNombre:1,
                                   strDireccion:1,
                                   blnRolDefault:1,
                                   Datos_apis:1// {$arrayElemAt:['$Datos_apis']}
                               }
                           }
                       ],
                       as: 'Roles'
                    }
                },
                {$project:
                    {
                        strNombre:1,
                        strApellido:1,
                        strDireccion:1,
                        strEmail:1,
                        idObjRol:1,
                        Roles: {$arrayElemAt:['$Roles',0]} 
                    }
                }
            ]);
            
            if(!obtenerusuariosAgregate)
            {
                return res.status(400).json(
                    {
                        ok:false,
                        msg: 'El usuario no se encuentra registrado o activo en la bd',
                        cont:
                        {
                            token: decoded.usuario
                        }
                    })
            }

            //valido que existe el rol
            //console.log(obtenerusuariosAgregate.Roles)
            if(!obtenerusuariosAgregate.Roles)
            {
                return res.status(400).json(
                    {
                        ok:false,
                        msg: 'El usuario no cuenta con el Rol asignado. Favor de verificar',
                        cont:
                        {
                            obtenerusuariosAgregate
                        }
                    })
            }
            
            //console.log(obtenerusuariosAgregate.Roles.Datos_apis);
            //console.log(obtenerusuariosAgregate.Roles.Datos_apis.length);
            //valido que tenga apis

            if(obtenerusuariosAgregate.Roles.Datos_apis)
            {
                if(obtenerusuariosAgregate.Roles.Datos_apis.length < 1 )
                {
                    return res.status(400).json(
                        {
                            ok:false,
                            msg: 'El usuario no cuenta con apis asignadas. Favor de verificar',
                            cont:
                            {
                                obtenerusuariosAgregate
                            }
                        })
                }
            }
            else
            {
                return res.status(400).json(
                    {
                        ok:false,
                        msg: 'El usuario no cuenta con el campo apis. Favor de verificar',
                        cont:
                        {
                            obtenerusuariosAgregate
                        }
                    })
            }

            const encontroRuta =  obtenerusuariosAgregate.Roles.Datos_apis.find(api => '/api' + api.strRuta === rutaorigen && api.strMetodo === originalMetodo);
            if(!encontroRuta)
            {
                return res.status(400).json(
                    {
                        ok:false,
                        msg: `El usuario no cuenta con el acceso a la ruta ${rutaorigen} del metodo ${originalMetodo}`,
                        cont:
                        {
                            obtenerusuariosAgregate
                        }
                    })
            }
            next();

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
    
}

module.exports = { verificarAcceso }