const express = require('express');
const app = express.Router();

//const arrJsnProductos=[{ _id:0, strNombre:'Adalh', nmbCantidad:0, strDescripcion:'', nmbPrecio:0}];
let arrJsnProductos=[];

app.get('/',(req,res)=>
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
})


module.exports = app;