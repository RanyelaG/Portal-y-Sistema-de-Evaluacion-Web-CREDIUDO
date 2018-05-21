var express = require ('express'); //requerimos el modulo express
var bodyParser = require("body-parser");
var router = express.Router();// se configura para poder consultar los datos desde la base de datos, entre otros usos.
var session = require("express-session");
var formidable = require('express-formidable');// para uso de sessiones
var fs= require('fs');
var path =require('path');

//-----------------------------------------------------------------------------------
var app = express(); // ejecutamos express en app para poder hacer uso de sus modulos
app.use(bodyParser.json());// hace parser buscar los archivos de los datos
app.use(bodyParser.urlencoded({extended: true}));
app.use(session(
  {
    secret: 'Fox',
    resave: false,
    saveUninitialized: true
  }
))
app.use(express.static(path.join(__dirname, 'public'))); // lo declaramos para utilizar archivos estaticos dentro de la aplicacion.
app.engine('html', require('ejs').renderFile);// para usar html y no jade como motor de plantilla
app.set("view engine", "html");
//app.use(formidable)
//app.use(fs) 
//-----------------------------------------------------------------------------------
//aqui van las rutas 
//RUTAS MONASTERIO
var index = require ('./routers/index.js'); //llamamos a la ruta index
var buscar_usuario = require ('./routers/buscar_usuario.js');
var modificar_usuario = require ('./routers/buscar_usuario.js');
var inicio = require('./routers/inicio.js');
var cerrar = require('./routers/cerrar.js');
var portal = require('./routers/portal.js');
var sesion_crediudo = require('./routers/sesion_crediudo.js');
var evaluacion = require('./routers/evaluacion.js')
var usuario_udo = require('./routers/usuario_udo.js')
//var personal = require ('./routers/personal.js')
//var nucleo = require ('./routers/nucleo.js')

//RUTAS DE LA CRUZ
var instrumento = require('./routers/instrumento.js');
var factor = require('./routers/factor.js')
var perfil_eval = require('./routers/perfil_coord_eval.js')
var modificar_datos = require('./routers/modificar_datos.js')
//-----------------------------------------------------------------------------------
//aqui van las vistas. 
//VISTA MONASTERIO
app.use('/', index);
app.use('/buscar_usuario', buscar_usuario);
app.use('/modificar_usuario', modificar_usuario);
app.use('/inicio', inicio);
app.use('/cerrar', cerrar);
app.use('/portal', portal);
app.use('/sesion_crediudo', sesion_crediudo);
app.use('/evaluacion', evaluacion);
app.use('/usuario_udo', usuario_udo);
//app.use('/indexSucre', indexSucre);
//app.use('/indexMonagas', indexMonagas);
//app.use('/indexBolivar', indexBolivar);
//app.use('/indexNueva', indexNueva);
//app.use('/indexAnzoategui', indexAnzoategui);


//VISTA DE LA CRUZ

app.use('/coord_eval/instrumento', instrumento);
app.use('/coord_eval/factor', factor);
app.use('/coord_eval/perfil', perfil_eval)
app.use('/modificar_datos', modificar_datos);



app.listen(8080); // inicializamos el servidor para que escuche por el puerto 8080  
console.log('servidor iniciado');