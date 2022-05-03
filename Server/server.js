require('./config/config');
require('colors');

const express = require('express');
const mongoose = require('mongoose');
const app =express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());  //debe de ir abajo del requiere file-upload

app.use(express.urlencoded({ extended:true }));
app.use('/api',require('./routes/index'));

//console.log(process.env.URLDB,'URLDB')
mongoose.connect(process.env.URLDB,(err,resp)=>
    {
        
        if(err)
        {
            console.log("error al conectar a la BD".red);
            return err;

        }
        
        console.log('base de datos online',(process.env.URLDB).blue);
    }
);

app.listen(process.env.PORT,()=>
    {
        console.log('[NODE]'.green,'esta corriendo en el puerto: ',(process.env.PORT).yellow
        );
    });