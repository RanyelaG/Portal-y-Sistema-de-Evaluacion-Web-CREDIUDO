let express = require('express') // instanciamos express
let router = express.Router() // llamamos al manejador de rutas de express
let models = require('../models/modelos')


router.get('/', function(req, res){	
  models.Nucleo.findAll({})
  .then(function(Nucleo){ res.render('./coor_planificacion/gestionar-evaluacion', {dataNucleo:Nucleo}) }) 
})


router.post('/buscar',function(req, res){
	console.log('el codigo del nucleo es', req.body.codigo)
	models.Unidad.findAll({
		where: {codigo_nucleo: req.body.codigo}
	})
	.then(function(Unidad){ res.render('./coor_planificacion/gestionar-evaluacion2', {dataUnidad:Unidad})
     })
     })


router.post('/crear', function(req, res){
	console.log('entraste aqui')
	console.log('nombre ', req.body.nombre)
	console.log('nombre  de la unidad ', req.body.unidad)

	models.Evaluacion.create({
		tipo: req.body.tipo_eval,
		name: req.body.nombre,
		codigo_unidad: req.body.unidad,
		inicio: req.body.fechai,
		enfoque: req.body.enfoque,
		fin: req.body.fechaf
	})

	 models.Nucleo.findAll({})
  .then(function(Nucleo){ res.render('./coor_planificacion/gestionar-evaluacion', {dataNucleo:Nucleo, exito:' hemos creado el usuario'}) }) 
})


router.get('/evaluacion', function(req, res){
	console.log('esta en evaluacion')
	models.Instrument.findOne({where:{id:'1'}})
	.then(function(Instrument){
console.log('el codigo del instrumento es ', Instrument.id)
		models.Factor.findAll({include:[models.Item]})
	    .then(function(Factor){
	    	
	    	
               res.status(201).send(Factor)
	    		console.log(Item)
	    		  //res.render('./personal_udo/evaluacionpersonal', {dataFactor:Factor, dataInstrument:Instrument, dataItem:Item})
	    
	   
	   
	 
        
	}) 
	})
	
	
		 
	})
	




module.exports = router;