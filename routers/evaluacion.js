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



module.exports = router;