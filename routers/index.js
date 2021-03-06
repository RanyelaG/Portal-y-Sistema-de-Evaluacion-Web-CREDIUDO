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
				models.Evento.findOne({
					order: [
						['id', 'DESC']
					]
				}).then(Evento => {
					res.render('index-web-principal-definitivo', {
						session: req.session, 
						dataEvaluacion:Evaluacion, 
						dataEvaluacion1:Evaluacion1,
						dataEvento:Evento
					})	
				})
			   
               console.log('Administravos Evaluacion', Evaluacion)
               console.log(' Centros evaluacion', Evaluacion1)
 			})
		})
     }else{
      models.Evaluacion.findOne({where: {tipo: 'administrativos'}})
		.then(function(Evaluacion){
			models.Evaluacion.findOne({where: {tipo:'centros'}})
			.then(function(Evaluacion1){
				models.Evento.findOne({
					order: [
						['id', 'DESC']
					]
				}).then(Evento => {
					res.render('index-web-principal-definitivo', {
						session: req.session, 
						dataEvaluacion:Evaluacion, 
						dataEvaluacion1:Evaluacion1,
						dataEvento:Evento
					})	
				})
			   
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
		
   
var informacion= nl2br(Sub_comision)
for(let i = 0; i < Sub_comision.length; i ++){ 
//	console.log('la informacion cargada es =======================', Sub_comision[i].informacion)
}


 res.render('./informacion_crediudo/sub-comi1', {dataSub:Sub_comision, informacion, session: req.session}) 
})
})

router.get('/etapas', function(req, res){ res.render('./informacion_crediudo/etapas-crediudo', {session: req.session}) })

router.get('/eventos', function(req, res){ 
	models.Evento.findAll({

	}).then(Evento => {
		res.render('./informacion_crediudo/eventos', {session: req.session, dataEvento:Evento})	
	})
})


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
router.get('/sucre', function(req, res){ res.render('./paginas-nucleos/sucre/index-sucre',{session: req.session})})
router.get('/monagas', function(req, res){ res.render('./paginas-nucleos/monagas/index-monagas',{session: req.session})})
router.get('/nvaesparta', function(req, res){ res.render('./paginas-nucleos/nvaesparta/index-nvaesparta',{session: req.session})})
router.get('/bolivar', function(req, res){ res.render('./paginas-nucleos/bolivar/index-bolivar',{session: req.session})})
router.get('/anzoategui', function(req, res){ res.render('./paginas-nucleos/anzoategui/index-anzoategui',{session: req.session})})
router.get('/boletinessucre', function(req, res){ res.render('./paginas-nucleos/sucre/boletines-sucre',{session: req.session})})
router.get('/eva-nucleo-sucre', function(req, res){ res.render('./paginas-nucleos/sucre/eva-nucleo-sucre',{session: req.session})})
router.get('/contacto-sucre', function(req, res){ res.render('./paginas-nucleos/sucre/contacto-sucre',{session: req.session})})
router.get('/info-sucre', function(req, res){ res.render('./paginas-nucleos/sucre/info-sucre',{session: req.session})})
router.get('/noti-sucre', function(req, res){ res.render('./paginas-nucleos/sucre/noti-sucre',{session: req.session})})
router.get('/detalle-sucre', function(req, res){ res.render('./paginas-nucleos/sucre/detalle-sucre',{session: req.session})})
router.get('/info-monagas', function(req, res){ res.render('./paginas-nucleos/monagas/info-monagas',{session: req.session})})
router.get('/boletines-monagas', function(req, res){ res.render('./paginas-nucleos/monagas/boletines-monagas',{session: req.session})})
router.get('/eva-nucleo-monagas', function(req, res){ res.render('./paginas-nucleos/monagas/eva-nucleo-monagas',{session: req.session})})
router.get('/detalle-monagas', function(req, res){ res.render('./paginas-nucleos/monagas/detalle-monagas',{session: req.session})})
router.get('/noti-monagas', function(req, res){ res.render('./paginas-nucleos/monagas/noti-monagas',{session: req.session})})
router.get('/contacto-monagas', function(req, res){ res.render('./paginas-nucleos/monagas/contacto-monagas',{session: req.session})})
router.get('/detalle-bolivar', function(req, res){ res.render('./paginas-nucleos/bolivar/detalle-bolivar',{session: req.session})})
router.get('/noti-bolivar', function(req, res){ res.render('./paginas-nucleos/bolivar/noti-bolivar',{session: req.session})})
router.get('/info-bolivar', function(req, res){ res.render('./paginas-nucleos/bolivar/info-bolivar',{session: req.session})})
router.get('/boletines-bolivar', function(req, res){ res.render('./paginas-nucleos/bolivar/boletines-bolivar',{session: req.session})})
router.get('/eva-nucleo-bolivar', function(req, res){ res.render('./paginas-nucleos/bolivar/eva-nucleo-bolivar',{session: req.session})})
router.get('/contacto-bolivar', function(req, res){ res.render('./paginas-nucleos/bolivar/contacto-bolivar',{session: req.session})})
router.get('/detalle-anzoategui', function(req, res){ res.render('./paginas-nucleos/anzoategui/detalle-anzoategui',{session: req.session})})
router.get('/boletines-anzoategui', function(req, res){ res.render('./paginas-nucleos/anzoategui/boletines-anzoategui',{session: req.session})})
router.get('/eva-nucleo-anzoategui', function(req, res){ res.render('./paginas-nucleos/anzoategui/eva-nucleo-anzoategui',{session: req.session})})
router.get('/info-anzoategui', function(req, res){ res.render('./paginas-nucleos/anzoategui/info-anzoategui',{session: req.session})})
router.get('/noti-anzoategui', function(req, res){ res.render('./paginas-nucleos/anzoategui/noti-anzoategui',{session: req.session})})
router.get('/contacto-anzoategui', function(req, res){ res.render('./paginas-nucleos/anzoategui/contacto-anzoategui',{session: req.session})})
router.get('/contacto-nvaesparta', function(req, res){ res.render('./paginas-nucleos/nvaesparta/contacto-nvaesparta',{session: req.session})})
router.get('/detalle-nva', function(req, res){ res.render('./paginas-nucleos/nvaesparta/detalle-nva',{session: req.session})})
router.get('/info-nva', function(req, res){ res.render('./paginas-nucleos/nvaesparta/info-nva',{session: req.session})})
router.get('/noti-nva', function(req, res){ res.render('./paginas-nucleos/nvaesparta/noti-nva',{session: req.session})})
router.get('/boletines-nva', function(req, res){ res.render('./paginas-nucleos/nvaesparta/boletines-nva',{session: req.session})})
router.get('/eva-nva2', function(req, res){ res.render('./paginas-nucleos/nvaesparta/eva-nucleo-nva',{session: req.session})})









/*=================================DE LA CRUZ=====================================*/
	router.post('/institucion/add-evento', (req,res) => {
		//CREAR LA INSTITUCION
		models.Institucion.create({
			nombre: req.body.nombre,
			representante: req.body.representante,
			rif: req.body.rif,
			email: req.body.email,
			tmovil: req.body.tmovil,
			thabitacion: req.body.thabitacion
		}).then(Institucion => {
			//BUSCAR LA INSTITUCION MAS RECIENTE
			models.Institucion.findOne({
				order: [
					['id', 'DESC']
				]
			}).then(Institucion => {
				//REGISTRAR LA INSTITUCION EN UN EVENTO
				models.Evento_Institucion.create({
					EventoId: req.body.eventoId,
					InstitucioneId: Institucion.id
				}).then(() => {
					//res.status(201).send(Institucion)
					res.redirect('/')
				})
				
			})
		})
	})
/*=================================DE LA CRUZ=====================================*/








module.exports = router;