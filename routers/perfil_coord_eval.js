let express = require('express') // instanciamos express
let router = express.Router() // llamamos al manejador de rutas de express
let models = require('../models/modelos')
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const crypto = require('crypto');
var session = require('express-session');

//MUY UTIL: res.status(201).send(todo)
router.use(function(req, res, next) {
  if(req.session.hasOwnProperty('cedula')){
    next();
  }else {
    console.log('no estas logueado')
    res.render('./sesion_crediudo/index-admin', {session: req.session})
  }
})

//PRIMERA RUTA UNA VEZ LOGUEADO
router.get('/edit', function(req,res){
	
	models.Cargo.findOne({
		where: { cedula_personal: req.session.cedula },
		include: [models.Personal]
	}).then(Cargo => {
		//res.status(201).send(Cargo)
		res.render('coor_evaluacion/perfil/index', { Cargos:Cargo })	
	})
});


router.post('/update', function(req, res){
	var session = req.session.cedula;
	let secret = 'bMqOztQx';
	let nakedPassword = req.body.password_act;
	const passwordInput = crypto.createHmac('sha256', secret)
                             .update(nakedPassword)
                             .digest('hex');

    models.Personal.findOne({
    	where: { cedula: session }
    }).then(Personal => {
    	if( Personal.password == passwordInput ){
    		let nakedPassword = req.body.new_password;
			const passwordInput = crypto.createHmac('sha256', secret)
		                             .update(nakedPassword)
		                             .digest('hex');

    		models.Personal.update({
				email: req.body.email,
				tmovil: req.body.tmovil,
				thabitacion: req.body.thabitacion,
				direccion: req.body.direccion,
				password: passwordInput
			},{
				where: {
					cedula: req.body.cedula
				}
			}).then((Personal) => {
					res.redirect('/coord_eval/perfil/edit')
					//res.status(201).send(Personal)
			})	
    	} else{
    		res.status(201).send(passwordInput);
    	}
    })
})

module.exports = router;