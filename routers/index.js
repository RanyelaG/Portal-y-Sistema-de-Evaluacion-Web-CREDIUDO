var express = require('express');
var router = express.Router();
var models = require('../models/modelos')
var nl2br  = require('nl2br');// paquete para reconocer los saltos de lineas al guardar en la base de datos

router.get('/', function(req, res){
	if(req.session.hasOwnProperty('cedula')) {

		 models.Evaluacion.findOne({where: {tipo: 'administrativos'}})
		.then(function(Evaluacion){
			models.Evaluacion.findOne({where: {tipo:'centros'}})
			.then(function(Evaluacion1){
			   res.render('index-web-principal-definitivo', {session: req.session, dataEvaluacion:Evaluacion,dataEvaluacion1:Evaluacion1})
               console.log('Administravos Evaluacion', Evaluacion)
               console.log(' Centros evaluacion', Evaluacion1)
 			})
		})
     }else{
      models.Evaluacion.findOne({where: {tipo: 'administrativos'}})
		.then(function(Evaluacion){
			models.Evaluacion.findOne({where: {tipo:'centros'}})
			.then(function(Evaluacion1){
			   res.render('index-web-principal-definitivo', {session: req.session, dataEvaluacion:Evaluacion,dataEvaluacion1:Evaluacion1})
               console.log('Administravos Evaluacion', Evaluacion)
               console.log(' Centros evaluacion', Evaluacion1)
 			})
		})
}

});

router.get('/informacion', function(req, res){
	models.Unidad.findOne({where:{codigo: '12'}})
	.then(function(Unidad){
		var creacion = nl2br(Unidad.creacion);
		var mision = nl2br(Unidad.mision);
		var proposito = nl2br(Unidad.proposito)


 res.render('./informacion_crediudo/informacion-crediudo',{creacion, mision, proposito, session: req.session})
	})
})

router.get('/objetivo', function(req, res){
	models.Unidad.findOne({where:{codigo: '12'}})
	.then(function(Unidad){
		var objetivos = nl2br(Unidad.objetivos)
		
 res.render('./informacion_crediudo/objetivos-crediudo',{dataUnidad:objetivos, session: req.session})
	})
})

router.get('/funcion', function(req, res){
	models.Unidad.findOne({where:{codigo: '12'}})
	.then(function(Unidad){
		var funcion = nl2br(Unidad.funcion)		
 res.render('./informacion_crediudo/funciones-crediudo',{funcion, session: req.session})
	})
})

router.get('/sub-comi', function(req, res){
	models.Sub_comision.findAll({})
	.then(function(Sub_comision){
		
   
var informacion= {Sub_comi:nl2br(Sub_comision)}
for(let i = 0; i < Sub_comision.length; i ++){ 
	console.log('la informacion cargada es =======================', Sub_comision[i].informacion)
} res.render('./informacion_crediudo/sub-comi', {dataSub:Sub_comision, informacion, session: req.session}) 
})
})

router.get('/etapas', function(req, res){ res.render('./informacion_crediudo/etapas-crediudo', {session: req.session}) })
router.get('/boletines', function(req, res){ res.render('./informacion_crediudo/boletines-informativos', {session: req.session}) })
router.get('/detalle', function(req, res){ res.render('./informacion_crediudo/detalle-noticias', {session: req.session}) })
router.get('/eva-anzo', function(req, res){ res.render('./informacion_crediudo/eva-anzo', {session: req.session}) })
router.get('/eva-boli', function(req, res){ res.render('./informacion_crediudo/eva-boli', {session: req.session}) })
router.get('/eva-mona', function(req, res){ res.render('./informacion_crediudo/eva-mona',  {session: req.session}) })
router.get('/eva-nva', function(req, res){ res.render('./informacion_crediudo/eva-nva',  {session: req.session}) })
router.get('/eva-sucre', function(req, res){ res.render('./informacion_crediudo/eva-sucre',  {session: req.session}) })
router.get('/info-crediudo', function(req, res){ res.render('./informacion_crediudo/info-crediudo',  {session: req.session}) })
router.get('/reglamento', function(req, res){ res.render('./informacion_crediudo/reglamentos-crediudo',  {session: req.session}) })
router.get('/noti-crediudo', function(req, res){ res.render('./informacion_crediudo/noti-crediudo',  {session: req.session}) })
router.get('/sucre', function(req, res){ res.render('./paginas-nucleos/sucre/index-sucre')})
router.get('/monagas', function(req, res){ res.render('./paginas-nucleos/monagas/index-monagas')})
router.get('/nvaesparta', function(req, res){ res.render('./paginas-nucleos/nvaesparta/index-nvaesparta')})
router.get('/bolivar', function(req, res){ res.render('./paginas-nucleos/bolivar/index-bolivar')})
router.get('/anzoategui', function(req, res){ res.render('./paginas-nucleos/anzoategui/index-anzoategui')})

module.exports = router;