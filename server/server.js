require('./config/config');
require('colors');

const express = require('express');
const mongoose = require('mongoose');
const app =express();
const fileUpload = require('express-fileupload');
const cors =require('cors');

app.use(fileUpload());  //debe de ir abajo del requiere file-upload
app.use(express.urlencoded({ extended:true }));
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    next();
});
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