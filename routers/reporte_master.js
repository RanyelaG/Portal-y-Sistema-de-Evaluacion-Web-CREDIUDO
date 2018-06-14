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
			models.Examen.findAll({include:[models.Personal],where:{UnidadCodigo:Unidad.codigo}})
		.then(function(Examen1){
			console.log('los Examenes encontrados son', Examen1)
/*
models.Examen.findAll({where:{PersonalCedula:req.session.cedula, [Op.and]:{tipo:{[Op.ne]:'eval_jef'}}}, order: [['fecha_examen','DESC']]})
       .then(function(Examen1){
       res.render('./personal_udo/historial-eva-personal-udo',{session:req.session,Examen1:Examen1} )
   })
*/

	 res.render('./usuario_master/visualizar-reportes-principal-usuario-master',{dataEvaluacion:Evaluacion, dataUnidad:Unidad, dataNucleo:Nucleo,Examen1:Examen1})
	})
	})
	})
})
})




router.get('/reporte_master/:id', function(req, res){

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
models.Examen.findOne({
	where:{id:req.params.id}
})
.then(function(Examen){

console.log('el Examen presentado es',Examen)
models.Instrument_e.findOne({
 where:{id:Examen.InstrumentEId}
}).then(function(Instrument_e){
models.Factor_e.findAll({include:[models.Item_e], where:{InstrumentEId:Examen.InstrumentEId}})
.then(function(Factor_e){
    models.Item_e.findAll({

       where:{FactorEId:Factor_e.id}
    }).then(function(Item_e){


     
 res.render('./usuario_master/visualizar-reportes-admin-usuario-master', {session:req.session,Examen:Examen,dataFactor:Factor_e,dataInstrument_e:Instrument_e, dataItem:Item_e,dataEvaluacion:Evaluacion, dataUnidad:Unidad, dataNucleo:Nucleo})
})// fin then Item_e
})// fin then Factor_e
})// fin then Instrument_e
})// fin Then Examen



})
})
})
})



module.exports = router;