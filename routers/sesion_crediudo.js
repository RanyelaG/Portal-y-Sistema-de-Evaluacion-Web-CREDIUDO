var express = require('express');
var router = express.Router();
var models = require('../models/modelos');
const crypto = require('crypto');
var session = require('express-session');

router.get('/', function(req, res){
	console.log('esta en el inicio de sesion personal crediudo');
res.render('./sesion_crediudo/index-admin');
});


router.post('/ingresar', function(req, res){
	console.log('pediste ingresar a crediudo')

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
      
        models.Cargo.findOne({where: {cedula_personal: Personal.cedula} })
        .then(function(Cargo){
          console.log(Cargo)
        console.log('El codigo de la unidad es', Cargo.codigo_unidad )
          console.log('el codigo del cargo es', Cargo.codigo)

        	if(Cargo.codigo_unidad ='12'){
        		if(Cargo.codigo=='1'){
        	
        	console.log('estas en la seccio de presidente Cargo codigo', Cargo.codigo )

                 res.render('./usuario_master/buscar_usuario', {session: req.session})
        
         }else if(Cargo.codigo =='2'){
          models.Instrument.findAll({})
          .then(function(Instrument){ res.render('instrumento/index_3', {dataInstrument:Instrument, session: req.session})
           });
         
          
         }else if(Cargo.codigo =='3'){
         models.Nucleo.findAll({})
           .then(function(Nucleo){ res.render('./coor_planificacion/gestionar-evaluacion', {dataNucleo:Nucleo}) }) 
           
         
          
         }

          } 
        })
        .catch(function(){
          console.log(' el personal no es crediudo')
        }) 

         // console.log('la cedula req.session.cedula ', req.session.cedula)
         // req.session.role = dataPersonal.role;
          
         // console.log(req.session.role);
         
        
        } 
      })

    }

})

router.get('/cerrar',(req, res)=>{
  req.session.destroy(()=>{
    console.log('cerrando sesion');
  });
res.render('./sesion_crediudo/index-admin');
});

module.exports = router;


