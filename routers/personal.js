let express = require('express') // instanciamos express
let router = express.Router() // llamamos al manejador de rutas de express
let models = require('../models/personal') // requerimos al modelos user en la carpeta usuario


router.get('/', function(req, res) {
  models.Personal.findAll().then(function(Uni) {
    res.render('personal',{dataUser:User});
  });
});

/*
router.post('/add', (req, res)=>{
model.Personal.create({
cedula: req.body.cedula
nombre: req.body.nombre

})
})

*/
router.post('/add', (req, res)=>{
	models.Personal.create({
		include:[model.Cargo]
	}).then(function(Personal){
		cedula: req.body.cedula,
		nombre: req.body.nombre,
		cargo: req.body.cargo

	})

})

//
module.exports = router;