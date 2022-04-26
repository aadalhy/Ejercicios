process.env.PORT = process.env.PORT || 3000;

let urlDB;

if(process.env.NODE_ENV === 'dev')
{
    urlDB ='mongodb://localhost:27017/Inventario'
}
else
{
    urlDB ='mongodb://localhost:27017/Inventario'
}

process.env.URLDB = urlDB;