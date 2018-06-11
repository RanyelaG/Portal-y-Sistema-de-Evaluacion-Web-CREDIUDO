let express = require('express'); // instanciamos express
let router = express.Router(); // llamamos al manejador de rutas de express
let models = require('../models/modelos');
var multer = require('multer'); //para el manejo de multipart/form usado para cargar archivos
const ejs = require('ejs');
const path = require('path');
var bodyParser = require("body-parser");

router.get('/add', function(req,res){console.log('estas agregando evento1')
	models.Nucleo.findAll({

	}).then(Nucleo => {
		res.render('coor_evaluacion/evento/index', { Nucleos:Nucleo })	
	})
})

router.post('/add', function(req, res){
	//Set storage Engine
	const storage = multer.diskStorage({
		destination: './public/uploads/eventos',
		filename: function(req, file, cb){
			cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
		}
	});

	//Init Upload
	const upload = multer({
		storage: storage, 
		limits: { fileSize: 1000000 },
		fileFilter: function(req, file, cb){
			checkFileType(file, cb);
		}
	}).single('urlImg');

	// Check File Type
	function checkFileType(file, cb){
		//allowed ext
		const filetypes = /jpeg|jpg|png|gif/;

		//Check ext
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

		//check mime
		const mimetype = filetypes.test(file.mimetype);

		if(mimetype && extname){
			return cb(null,true);
		} else{
			cb('Error: Images Only!');
		}
	}

	upload(req,res,(err) => {
		if(err){
			res.render('hola', { msg: err });
		} else{
			if(req.file == undefined){
				console.log(req.file);
				res.render('aaaaaa', { msg: 'Error: Ningun Archivo Seleccionado!' });
			} else{
				console.log(req.file.filename);
				models.Evento.create({
					nombre: req.body.nombre,
					direccion: req.body.direccion,
					dirigido_a: req.body.dirigido_a,
					fecha: req.body.fecha,
					capacidad: req.body.capacidad,
					tipo: req.body.tipo,
					descripcion: req.body.descripcion,
					NucleoCodigo: req.body.NucleoCodigo,
					urlImg: req.file.filename
				}).then(() => {
					models.Nucleo.findAll({

					}).then(Nucleo => {
						console.log(req.file.filename);
						res.render('coor_evaluacion/evento/index', { Nucleos:Nucleo, fino:'' })	
					});
				});
			}
		}
	});
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
	//Set storage Engine
	const storage = multer.diskStorage({
		destination: './public/uploads/eventos',
		filename: function(req, file, cb){
			cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
		}
	});

	//Init Upload
	const upload = multer({
		storage: storage, 
		limits: { fileSize: 1000000 },
		fileFilter: function(req, file, cb){
			checkFileType(file, cb);
		}
	}).single('urlImg');

	// Check File Type
	function checkFileType(file, cb){
		//allowed ext
		const filetypes = /jpeg|jpg|png|gif/;

		//Check ext
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

		//check mime
		const mimetype = filetypes.test(file.mimetype);

		if(mimetype && extname){
			return cb(null,true);
		} else{
			cb('Error: Images Only!');
		}
	}

	upload(req,res,(err) => {
		if(err){
			res.render('hola', { msg: err });
		} else{
			if(req.file == undefined){
				console.log(req.file);
				res.render('aaaaaa', { msg: 'Error: Ningun Archivo Seleccionado!' });
			} else{
				console.log(req.file.filename);
				models.Evento.update({
					nombre: req.body.nombre,
					direccion: req.body.direccion,
					dirigido_a: req.body.dirigido_a,
					fecha: req.body.fecha,
					capacidad: req.body.capacidad,
					tipo: 'nacional',
					descripcion: req.body.descripcion,
					NucleoCodigo: req.body.NucleoCodigo,
					urlImg: req.file.filename
				}, {
					where: { id: req.body.id }
				}).then(Evento => {
					res.redirect('/coord_eval/eventos/edit')
				})
			}
		}
	});
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