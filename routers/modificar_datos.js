var express = require('express');
var router = express.Router();
var models = require('../models/modelos')
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const crypto = require('crypto');
var session = require('express-session');
/*
router.use(function(req, res, next) {
  router.use('/', function(req, res, next){
  if(req.session.hasOwnProperty('cedula')) {
   next();
   }else{res.render('./sesion_crediudo/index-admin')}    

})

})
*/

router.get('/', function(req, res){
	console.log(' estas en la modificacion de usuario')
	models.Cargo.findOne({
		where: { cedula_personal: req.session.cedula },
		include: [models.Personal]
	}).then(Cargo => {
		if(Cargo.codigo=='1'){
		res.render('./actualizar_datos/actualizar-datos-perfil-master', { dataCargo:Cargo })
	}else if(Cargo.codigo=='2'){
		res.render('./actualizar_datos/actualizar-datos-coordinador-planificacion', { dataCargo:Cargo })

	}else if(Cargo.codigo=='3'){
	res.render('./actualizar_datos/actualizar-datos-coordinador-planificacion', { dataCargo:Cargo })
	}
	})


	
})

router.post('/edit', function(req, res){
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
					res.redirect('/modificar_datos')
					//res.status(201).send(Personal)
			})	
    	} else{
    		res.status(201).send(passwordInput);
    	}
    })
    

   
})

module.exports = router;