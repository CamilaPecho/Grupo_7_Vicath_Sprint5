//Solicitamos dependencias instaladas 🎈🎄
const express = require('express');
const methodOverride = require('method-override');

//Importamos el sistema de rooteo 😂 
const main = require("./src/routers/main");
const users = require("./src/routers/users");
const products = require("./src/routers/products");
//

//Tenemos a mano la ejecución de express 🎁
const app = express();

//Middlewares de aplicación global
app.use(express.static('public'));

//😊 Con esto configuramos la aplicación para sobrescribir los métodos admitidos por el formulario 😎
app.use(methodOverride('_method'));

//Establecimiento de motor de plantillas 👓
app.set("view engine","ejs");
app.set("views","./src/views");

//Con esto indicamos que todo la info. capturada de un formulario 😋 lo quiere en objeto literal y que tengamos la posibilidad de convertir dicho objeto a un archivo JSON cuando queramos
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Establecimiento de recursos genericos =================================================
app.use("/", main);
app.use('/', users);
app.use('/products', products);
//=======================================================================================

//Va al final de todo para que no capture peticiónes que de verdad no existen 😐
app.use((req, res, next) => 
{
    res.status(404).render('paginaNoEncontrada');
})

//Abriendo puertos 🛩
app.listen (process.env.PORT || 3001, ()=>{
    console.log('⭐ Servidor funcionando en el puerto 3001 ⭐');
});

