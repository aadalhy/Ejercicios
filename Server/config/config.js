process.env.PORT = process.env.PORT || 3000;

let urlDB;

if(process.env.NODE_ENV === 'dev')
{
    urlDB ='mongodb://localhost:27017/dbTipoDeDatos'
}
else
{
    urlDB ='mongodb://localhost:27017/dbTipoDeDatos'
}

process.env.URLDB = urlDB;