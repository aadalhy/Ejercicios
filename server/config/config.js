process.env.PORT = process.env.PORT || 3000;

let urlDB;

if(process.env.NODE_ENV === 'dev')
{
    urlDB ="mongodb+srv://adalhy:r06a07ra@cluster0.gka8k.mongodb.net/Bootcamp?retryWrites=true&w=majority"
    //'mongodb://localhost:27017/Inventario'
}
else
{
    urlDB ="mongodb+srv://adalhy:r06a07ra@cluster0.gka8k.mongodb.net/Bootcamp?retryWrites=true&w=majority"
    //'mongodb://localhost:27017/Inventario'
}

process.env.URLDB = urlDB;

process.env.SEED = process.env.SEED || 'Firma-Secreta';
process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || '10d'