const jwt = require('jsonwebtoken');
require('../config/config');

const verificarAcceso = async (req , res, next) => {
    try {
        //console.log('estoy en el middleware');
        const token = req.get('token');
        const ruta = req.originalUrl;

        if(!token)
        {
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

        jwt.verify(token, process.env.SEED, (err, decoded) => {
            if(err)
            {
               //console.log(err.name);
               console.log("No se permitio el acceso a la ruta: ",(ruta).red); 
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
            console.log("Se permitio el acceso a la ruta: " ,(ruta).green);
            next();
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
    
}

module.exports = { verificarAcceso }