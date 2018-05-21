let express = require('express') // instanciamos express
let router = express.Router() // llamamos al manejador de rutas de express
let models = require('../models/modelos')

router.get('/add', function(req,res){
	models.Nucleo.findAll({

	}).then(Nucleo => {
		res.render('coor_evaluacion/evento/index', { Nucleos:Nucleo })	
	})
})

router.post('/add', function(req, res){
	models.Evento.create({
		nombre: req.body.nombre,
		direccion: req.body.direccion,
		dirigido_a: req.body.dirigido_a,
		fecha: req.body.fecha,
		capacidad: req.body.capacidad,
		tipo: req.body.tipo,
		descripcion: req.body.descripcion,
		NucleoCodigo: req.body.NucleoCodigo
	}).then(() => {
		models.Nucleo.findAll({

		}).then(Nucleo => {
			res.render('coor_evaluacion/evento/index', { Nucleos:Nucleo, fino:'' })	
		})
		
		//res.redirect('/coord_eval/eventos/add')
	})
})

module.exports = router;