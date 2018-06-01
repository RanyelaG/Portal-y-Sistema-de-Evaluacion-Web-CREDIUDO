var express = require('express');
var router = express.Router();
var models = require('../models/modelos')
const crypto = require('crypto');
var session = require('express-session')


router.get('/', function(req, res){
	console.log('fuiste a inicio de sesion ')
res.render('inicio');
});

router.post('/ingresar', function(req, res){
	console.log('pediste ingresar a crediudo')
  console.log(' la cedula del body es ', req.body.cedula);
   console.log(' la cedula del body es ', req.body.password);

if(!req.body.cedula || !req.body.password){
  console.log('cedula es ', req.body.cedula)
   console.log('clave es ', req.body.password)

	console.log('estas en la primera parte')
    res.render('inicio')
  } else {
      models.Personal.findOne({ where: {cedula: req.body.cedula} })
      .then(function(Personal){
        let secret = Personal.salt
        let nakedPassword = req.body.password;
        const passwordInput = crypto.createHmac('sha256', secret)
                             .update(nakedPassword)
                             .digest('hex');        
        if(passwordInput === Personal.password){
        console.log('cedula ingresada en ', req.body.cedula)
        req.session.cedula = req.body.cedula;
        req.session.nombre = Personal.nombre;
        req.session.apellido = Personal.apellido;
        models.Cargo.findOne({
          where: {cedula_personal: req.body.cedula}
        })
        .then(function(Cargo){
          if(Cargo.codigo_unidad='12'){
            console.log('el personal es de crediudo')}

        })
        .catch(function(){
          console.log(' el personal no es crediudo')
        })

        models.Evaluacion.findOne({where: {tipo: 'administrativos'}})
    .then(function(Evaluacion){
      models.Evaluacion.findOne({where: {tipo:'centros'}})
      .then(function(Evaluacion1){
        var backUrl=req.header('referer')
        res.redirect(backUrl, 302,{session: req.session, dataEvaluacion:Evaluacion,dataEvaluacion1:Evaluacion1})
              //{session: req.session, dataEvaluacion:Evaluacion,dataEvaluacion1:Evaluacion1}
      })
    })
        } else {
         console.log('error al iniciar sesion 1')
        }

      })

    }

})

module.exports = router;