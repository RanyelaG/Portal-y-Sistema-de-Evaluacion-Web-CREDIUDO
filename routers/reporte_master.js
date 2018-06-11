var express = require('express');
var router = express.Router();
var models = require('../models/modelos')
var Sequelize = require('sequelize');
var Op = Sequelize.Op;


router.get('/', function(req, res){ 

	models.Evaluacion.findOne({})
	.then(function(Evaluacion){
		models.Unidad.findOne({
			where:{codigo:Evaluacion.codigo_unidad}
	})
	.then(function(Unidad){
		models.Nucleo.findOne({
			where:{codigo: Unidad.codigo_nucleo}
		})
		.then(function(Nucleo){

	 res.render('./usuario_master/visualizar-reportes-admin-usuario-master',{dataEvaluacion:Evaluacion, dataUnidad:Unidad, dataNucleo:Nucleo})

	})
	})
})
})

module.exports = router;