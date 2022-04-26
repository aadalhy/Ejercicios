const express = require('express');
const productoModel = require('../../models/producto/producto.model');
const app = express.Router();
const ProductoModel = require('../../models/producto/producto.model');

//const arrJsnProductos=[{ _id:0, strNombre:'Adalh', nmbCantidad:0, strDescripcion:'', nmbPrecio:0}];
//let arrJsnProductos=[];

app.get('/', async (req,res) => {

    try {
        const obtenerproductos = await ProductoModel.find();

        //console.log(obtenerproductos);

        if(!obtenerproductos.length>0) 
        {
            return res.status(400).json({
                ok: false,
                msg:'No hay productos en la base de datos',
                cont:
                {
                    obtenerproductos
                }
            })
        }

        return res.status(200).json({
            ok: true,
            msg:'Si hay productos en la base de datos',
            cont:
            {
                obtenerproductos
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


app.post('/', async (req,res) =>{
    
    try {
        const body = req.body;
        const productoBody = new ProductoModel(body);
        const err = productoBody.validateSync();

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

        const obtenerProducto = await ProductoModel.findOne({strNombre:body.strNombre},{strNombre:1});
        
        if (obtenerProducto)
            {
                return res.status(400).json(
                    {
                        ok:false,
                        msg: 'Ya se encuentra un producto con ese nombre',
                        cont:
                        {
                           obtenerProducto
                        }
                    }) 

            }

        const registradoP = await productoBody.save();

        return res.status(200).json({
            ok: true,
            msg:'El producto se registro correctamente',
            cont:
            {
                registradoP
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


app.put('/', async (req,res) =>{

    try {
        const _idProducto = req.query._idProducto;

        //validamos que se envie un id, o que el id no tenga la longitud correcta
        if (!_idProducto || _idProducto.length !=24)
        {
            return res.status(400).json(
                {
                    ok:false,
                    //utilizamos un operador ternarrio para validar cual de las 2 condiciones es la que se esta cumpliendo
                    msg: _idProducto ? 'El id no es valido, se requiere un id de almenos 24 caracteres' : 'No se recibio un producto',
                    cont:
                    {
                        _idProducto
                    }
                }) 
        }

        const encontroProducto = await ProductoModel.findOne({_id: _idProducto});
        //console.log(encontoProducto);

        if (!encontroProducto)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'No se encuentra registrado el producto',
                    cont:
                    {
                        _idProducto
                    }
                }) 

        }

        //solo regresa estadstica delo que realizo
        // se puede realizar el update por cualquier campo
        //const actualizarProducto = await ProductoModel.updateOne({_id: _idProducto}, { $set:{ ...req.body}});
        // acknowledged: true,
        // modifiedCount: 1,
        // upsertedId: null,
        // upsertedCount: 0,
        // matchedCount: 1

        //se realiza solo  por el id 
        //regresa la informacion de lo que modifico
        // acknowledged: true,
        // modifiedCount: 1,
        // upsertedId: null,
        // upsertedCount: 0,
        // matchedCount: 1
        const actualizarProducto = await ProductoModel.findByIdAndUpdate(_idProducto, { $set:{ ...req.body}}, {new :true});
        //console.log(actualizarProducto);

        if (!actualizarProducto)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'No se logro actualizar el producto',
                    cont:
                    {
                        ...req.body
                    }
                }) 

        }

        return res.status(200).json(
            {
                ok:true,
                msg: 'El producto se actualizo de manera existosa',
                cont:
                {
                    productoAnterior: encontroProducto,
                    productoActual: actualizarProducto  //req.body
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

//los datos se envian preferentemente por query o params
app.delete('/', async (req,res) =>{
    
    try {
        //identificar el elemento a eliminar
        const _idProducto = req.query._idProducto;

        //validamos que se envie un id, o que el id no tenga la longitud correcta
        if (!_idProducto || _idProducto.length !=24)
        {
            return res.status(400).json(
                {
                    ok:false,
                    //utilizamos un operador ternarrio para validar cual de las 2 condiciones es la que se esta cumpliendo
                    msg: _idProducto ? 'El id no es valido, se requiere un id de almenos 24 caracteres' : 'No se recibio un producto',
                    cont:
                    {
                        _idProducto
                    }
                }) 
        }

        const encontroProducto = await ProductoModel.findOne({_id: _idProducto, blnEstado:true});
        
        if (!encontroProducto)
            {
                return res.status(400).json(
                    {
                        ok:false,
                        msg: 'No se encuentra registrado el producto',
                        cont:
                        {
                            _idProducto: _idProducto
                        }
                    }) 

            }

        //Este elimina de manera definitva elproducto
        //const eliminarProducto= await ProductoModel.findOneAndDelete({_id: _idProducto});

        //Esta funcion solo cambia el estado del producto
        const eliminarProducto= await ProductoModel.findOneAndUpdate({_id: _idProducto},{$set:{blnEstado:false}},{new:true});

        if (!eliminarProducto)
            {
                return res.status(400).json(
                    {
                        ok:false,
                        msg: 'No se logro desactivar el producto',
                        cont:
                        {
                            ...req.body
                        }
                    }) 

            }

            return res.status(200).json(
                {
                    ok:true,
                    msg: 'El producto se desactivar de manera existosa',
                    cont:
                    {
                        productoEliminado: eliminarProducto  //req.body
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
/*app.get('/',(req,res)=>
{
    const arrProducto = arrJsnProductos;

    console.log(arrProducto.length);

    if(arrProducto.length==0) 
    {
        return res.status(400).json({
            ok: false,
            msg:'No hay productos producto',
            cont:
            {
                arrProducto
            }
        })
    }

    return res.status(200).json({
        ok: true,
        msg:'Si hay productos',
        cont:
        {
            arrProducto
        }
    })
    
})

app.post('/',(req,res)=>
{
    const  body=
    {
        strNombre: req.body.strNombre,
        strDescripcion: req.body.strDescripcion,
        nmbCantidad: Number(req.body.nmbCantidad),
        nmbPrecio: Number(req.body.nmbPrecio),
        _id: Number(req.body._id)
    }

    if (!body._id || !body.strNombre || !body.strDescripcion || !body.nmbCantidad || !body.nmbPrecio)
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

    const encuentra=arrJsnProductos.find(producto => producto._id === body._id)

    if(encuentra)
    {
        return res.status(400).json(
            {
                ok:false,
                msg: 'El id del producto ya existe',
                cont:
                {
                    encuentra
                }
            })
    }
    
    arrJsnProductos.push(body);

    res.status(200).json(
        {
            ok:true,
            msg: 'Se registro el producto',
            cont:
            {
                arrJsnProductos
            }
        })
        
    
})

app.put('/',(req,res)=>
{
    const _idProducto = parseInt(req.body._id);

    console.log (_idProducto);

    if(! _idProducto)
    {
        return res.status(400).json
            ({
                ok:false,
                msg:'El id del producto no es valido',
                cont:
                {
                    _idProducto
                }
            })
    }

    const encontro = arrJsnProductos.find(producto => producto._id === _idProducto);
        
    if (!encontro)
    {
        return res.status(400).json
            ({
                ok:false,
                msg:`El producto con el id: ${_idProducto} no se encuentra registrado.`,
                cont:
                {
                    _idProducto
                }
            }) 
    }

    const actualizar = {_id:_idProducto, strNombre:req.body.strNombre, strDescripcion:req.body.strDescripcion, nmbCantidad:req.body.nmbCantidad, nmbPrecio: req.body.nmbPrecio }
            
    const filtrarproducto = arrJsnProductos.filter(producto => producto._id != _idProducto);
    
    arrJsnProductos = filtrarproducto;

    arrJsnProductos.push(actualizar);

    return res.status(200).json
    ({
        ok:true,
        msg:`El producto con el id: ${_idProducto} se actualizo de manera exitosa`,
        cont:
        {
            actualizar
        }
    }) 


})

app.delete('/',(req,res)=>
{
    const _idProducto = parseInt(req.body._id);

    if(!_idProducto)
    {
        return res.status(400).json
            ({
                ok:false,
                msg:'El id del producto no es valido',
                cont:
                {
                    _idProducto
                }
            })
    }

    const encontro = arrJsnProductos.find(producto => producto._id === _idProducto);
        
    if (!encontro)
    {
        return res.status(400).json
            ({
                ok:false,
                msg:`El producto con el id: ${_idProducto} no se encuentra registrado.`,
                cont:
                {
                    _idProducto
                }
            }) 
    }

    const eliminar = {_id:_idProducto, strNombre:req.body.strNombre, strDescripcion:req.body.strDescripcion, nmbCantidad:req.body.nmbCantidad, nmbPrecio: req.body.nmbPrecio }
            
    const filtrarproducto = arrJsnProductos.filter(producto => producto._id != _idProducto);
    
    arrJsnProductos = filtrarproducto;

    return res.status(200).json
        ({
            ok:true,
            msg:`El producto con el id: ${_idProducto} se elimino de manera exitosa`,
            cont:
            {
                eliminar
            }
        }) 
})*/


module.exports = app;