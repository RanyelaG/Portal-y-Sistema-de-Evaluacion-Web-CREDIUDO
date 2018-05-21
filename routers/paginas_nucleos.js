var express = require('express');
var router = express.Router();
var models = require('../models/modelos')
var nl2br  = require('nl2br');// paquete para reconocer los saltos de lineas al guardar en la base de datos



router.get('/', function(req, res){
 res.render('./paginas-nucleos/sucre/index-sucre')
	})



module.exports = router;