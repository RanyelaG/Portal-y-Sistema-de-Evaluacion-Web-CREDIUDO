let express = require('express') // instanciamos express
let router = express.Router() // llamamos al manejador de rutas de express
let models = require('../models/modelos')

router.get('/add', function(req,res){console.log('estas agregando evento1')
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

router.get('/ver_instituciones', (req,res) => {
	models.Evento_Institucion.findAll({
		include: [ models.Evento, models.Institucion ]
	}).then(Registrados => {
		models.Evento.findAll({
			where: { tipo: 'nacional' },
			
		}).then(Evento => {
			res.render('coor_evaluacion/evento/ver_instituciones', { 
				Eventos:Evento, Registrados:Registrados 
			})	
			//res.status(201).send(Registrados)
		})
		
		
	})
	
})

router.get('/edit', (req, res) => {
	models.Evento.findAll({
		include: [ models.Nucleo ]		
	}).then(Evento => {
		models.Nucleo.findAll({

		}).then(Nucleo => {
			res.render('coor_evaluacion/evento/edit_eventos', { Eventos:Evento, Nucleos:Nucleo })
			//res.status(201).send(Evento)	
		})
			
	})
	
})

router.post('/update', (req,res) => {
	models.Evento.update({
		nombre: req.body.nombre,
		direccion: req.body.direccion,
		dirigido_a: req.body.dirigido_a,
		//fecha: req.body.fecha,
		capacidad: req.body.capacidad,
		tipo: 'nacional',
		descripcion: req.body.descripcion,
		NucleoCodigo: req.body.NucleoCodigo
	}, {
		where: { id: req.body.id }
	}).then(Evento => {
		res.redirect('/coord_eval/eventos/edit')
	})
})

router.get('/delete/:id', (req,res) => {
	models.Evento.destroy({
        where: {
        	id: req.params.id
        }
    }).then(()=>{
          res.redirect('/coord_eval/eventos/edit')
    })
})

module.exports = router;