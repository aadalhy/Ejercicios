const express = require('express');
const empresaModel = require('../../models/empresa/empresa.model');
const app = express.Router();
const EmpresaModel = require('../../models/empresa/empresa.model');
const { verificarAcceso } = require('../../middlewares/permisos');

app.get('/',  async (req,res) => {
    
    try {
        const _blnEstado = req.query.blnEstado == "false" ? false : true ;
        const obtenerEmpresas = await EmpresaModel.find({blnEstado: _blnEstado});

        //funcion agregate
        const obtenerEmpresasAgregate = await EmpresaModel.aggregate([
            {$project: {strNombre:1, blnEstado:1} },
            {$match: {$expr: {$eq: ["$blnEstado", _blnEstado] } }},
        ]);

       
        if(!obtenerEmpresas.length>0) 
        {
            return res.status(400).json({
                ok: false,
                msg:'No hay Empresas en la base de datos',
                count: obtenerEmpresas.length,
                cont:
                {
                    obtenerEmpresas,
                    obtenerEmpresasAgregate
                }
            })
        }
        
        return res.status(200).json({
            ok: true,
            msg:'Si hay Empresas en la base de datos',
            count: obtenerEmpresas.length,
            cont:
            {
                obtenerEmpresas,
                obtenerEmpresasAgregate
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

});

app.post('/', verificarAcceso, async (req,res) =>{
    
    try {
        const body = req.body;
        const EmpresaBody = new EmpresaModel(body);
        const err = EmpresaBody.validateSync();

        if (err)
        {
            return res.status(400).json({
                ok: false,
                msg:'No se recibio algun campo favor de validar',
                cont:
                {
                    err
                }
            })
        }

        const obtenerEmpresa = await EmpresaModel.findOne({strNombre:body.strNombre},{strNombre:1});
        
        if (obtenerEmpresa)
            {
                return res.status(400).json(
                    {
                        ok:false,
                        msg: 'Ya se encuentra una Empresa con ese nombre',
                        cont:
                        {
                           obtenerEmpresa
                        }
                    }) 

            }

        const registrado = await EmpresaBody.save();

        return res.status(200).json({
            ok: true,
            msg:'La Empresa se registro correctamente',
            cont:
            {
                registrado
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

app.put('/', verificarAcceso, async (req,res) =>{

    try {
        const _idEmpresa = req.query._idEmpresa;

        //validamos que se envie un id, o que el id no tenga la longitud correcta
        if (!_idEmpresa || _idEmpresa.length !=24)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: _idEmpresa ? 'El id no es valido, se requiere un id de almenos 24 caracteres' : 'No se recibio la empresa',
                    cont:
                    {
                        _idEmpresa
                    }
                }) 
        }

        const encontroEmpresa = await EmpresaModel.findOne({_id: _idEmpresa, blnEstado:true});
        //console.log(encontoEmpresa);

        if (!encontroEmpresa)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'La empresa esta desactivada',
                    cont:
                    {
                        _idEmpresa
                    }
                }) 

        }

        const encontroNombreEmpresa = await EmpresaModel.findOne({strNombre: req.body.strNombre, _id:{$ne: _idEmpresa}},{strNombre:1, strDescripcion:1});

        //console.log(encontroNombreUsuario);

        if (encontroNombreEmpresa)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'El nombre de la Empresa ya se encuentra registrado',
                    cont:
                    {
                        encontroNombreEmpresa
                    }
                }) 

        }

        const actualizarEmpresa = await EmpresaModel.findByIdAndUpdate(_idEmpresa, { $set:{ ...req.body}}, {new :true});
        //console.log(actualizarEmpresa);

        if (!actualizarEmpresa)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'No se logro actualizar la Empresa',
                    cont:
                    {
                        ...req.body
                    }
                }) 

        }

        return res.status(200).json(
            {
                ok:true,
                msg: 'El Empresa se actualizo de manera existosa',
                cont:
                {
                    EmpresaAnterior: encontroEmpresa,
                    EmpresaActual: actualizarEmpresa  //req.body
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

app.delete('/', verificarAcceso, async (req,res) =>{
    
    try {
        //identificar el elemento a eliminar
        const _idEmpresa = req.query._idEmpresa;
        const _blnEstado = req.query.blnEstado == "false" ? false : true ;
        //validamos que se envie un id, o que el id no tenga la longitud correcta
        if (!_idEmpresa || _idEmpresa.length !=24)
        {
            return res.status(400).json(
                {
                    ok:false,
                    //utilizamos un operador ternarrio para validar cual de las 2 condiciones es la que se esta cumpliendo
                    msg: _idEmpresa ? 'El id no es valido, se requiere un id de almenos 24 caracteres' : 'No se recibio un Empresa',
                    cont:
                    {
                        _idEmpresa
                    }
                }) 
        }

        const encontroEmpresa = await EmpresaModel.findOne({_id: _idEmpresa});
        
        if (!encontroEmpresa)
            {
                return res.status(400).json(
                    {
                        ok:false,
                        msg: 'No se encuentra registrada la Empresa',
                        cont:
                        {
                            _idEmpresa: _idEmpresa
                        }
                    }) 

            }


        //Esta funcion solo cambia el estado del Empresa
        const eliminarEmpresa= await EmpresaModel.findOneAndUpdate({_id: _idEmpresa},{$set:{blnEstado:_blnEstado}},{new:true});

        if (!eliminarEmpresa)
            {
                return res.status(400).json(
                    {
                        ok:false,
                        msg: 'No se realiza ninguna modificacion' ,
                        cont:
                        {
                            ...req.body
                        }
                    }) 

            }

            return res.status(200).json(
                {
                    ok:true,
                    msg: _blnEstado == true ? 'Se activo la Empresa de manera existosa' : 'La empresa se desactivo de manera exitosa' ,
                    cont:
                    {
                        EmpresaEliminado: eliminarEmpresa  //req.body
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