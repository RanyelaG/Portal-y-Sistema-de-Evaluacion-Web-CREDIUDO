var express = require('express');
var router = express.Router();
var models = require('../models/modelos')
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var nl2br  = require('nl2br');
var formidable = require('express-formidable');
var FormData = require('form-data');



//=============================================listar usuario
router.get('/', function(req, res){
	models.Unidad.findOne({where:{codigo: '12'}})
	.then(function(Unidad){
		models.Sub_comision.findAll({
				order: [['codigo','ASC']]
		})
		.then(function(Sub_comision){
			console.log('las Sub_comisiones son', Sub_comision)
			res.render('./usuario_master/modificar-portal', {dataUnidad:Unidad, dataSub:Sub_comision})
		})
		})
		
	 	})


router.post('/actualizar',function(req, res){
	
	models.Unidad.update({
		creacion: req.body.creacion,
		mision: req.body.mision,
		proposito: req.body.proposito,
		objetivos: req.body.objetivos,
		funcion: req.body.funcion,
		etapa: req.body.etapa
	 },{where:{codigo: '12'}})
		.then(function(Unidad){ models.Unidad.findOne({where: {codigo: '12'}})
			.then(function(Unidad1){
				
            if(!req.body.codigo){
                
                 models.Sub_comision.findAll({
                 	order: [['codigo','ASC']]
                 })
                 .then(function(Sub_comision){
                 	res.render('./usuario_master/modificar-portal', {dataUnidad:Unidad1, dataSub:Sub_comision})
                 })

				}else{
                console.log('estas en el else')
				    models.Sub_comision.update({
				 	nombre: req.body.nombre,
				 	informacion: req.body.informacion
				 },{where: {codigo: req.body.codigo}})
                 .then(function(Sub_comision){
                 	models.Sub_comision.findAll({
                 		order: [['codigo','ASC']]
                 	})
                 	.then(function(Sub_comision1){
                 	res.render('./usuario_master/modificar-portal', {dataUnidad:Unidad1, dataSub:Sub_comision1})
                 	})
                 })

				}
			})
	        })
   })


router.get('/eliminar/:codigo', function(req, res){
	console.log('el codigo es ', req.params.codigo )
	models.Sub_comision.destroy({where:{codigo:req.params.codigo}})
	.then(function(Sub_comision1){

		models.Unidad.findOne({where:{codigo: '12'}})
	.then(function(Unidad){
		models.Sub_comision.findAll({order: [['codigo','ASC']]})
		.then(function(Sub_comision){
			console.log('las Sub_comisiones son', Sub_comision)
			res.render('./usuario_master/modificar-portal', {dataUnidad:Unidad, dataSub:Sub_comision})
		})
		})
      	})
	})



router.post('/agregar_comision', function(req, res){
	//console.log('el req.files envia=====================', req.files.nombre)
	console.log('DATSO')
	console.log(req)

	
//var form = new FormData ();
 //form.append('my_field', 'my value');

	models.Sub_comision.create({

		codigo: req.body.codigo,
		nombre: req.body.nombre,
		informacion: req.body.informacion
	})
	.then(function(Sub_comision){
     	models.Unidad.findOne({where:{codigo: '12'}})
	.then(function(Unidad){
		models.Sub_comision.findAll({order: [['codigo','ASC']]})
		.then(function(Sub_comision){
			console.log('las Sub_comisiones son', Sub_comision)
			res.render('./usuario_master/modificar-portal', {dataUnidad:Unidad, dataSub:Sub_comision})
		})
		})
      	})
	


	})

router.get('/siguiente', function(req, res){ res.render('./usuario_master/modificar-portal1',{session: req.session})})






module.exports = router;