var express = require('express');
var router = express.Router();
var models = require('../models/modelos')
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

/*
router.use('/', function(req, res, next){
  if(req.session.hasOwnProperty('cedula')) {
   next();
     }else{
      models.Evaluacion.findOne({where: {tipo: 'administrativos'}})
    .then(function(Evaluacion){
      models.Evaluacion.findOne({where: {tipo:'centros'}})
      .then(function(Evaluacion1){
         res.render('index-web-principal-definitivo', {session: req.session, dataEvaluacion:Evaluacion,dataEvaluacion1:Evaluacion1})
               console.log('Administravos Evaluacion', Evaluacion)
               console.log(' Centros evaluacion', Evaluacion1)
      })
    })
}

});

*/
//=============================================listar usuario
router.get('/', function(req, res){
  //models.Personal.findAll().then(function(Personal){
     res.render('./usuario_master/buscar_usuario', {session: req.session})
  //});
//res.render('Crear-usuario-perfil-master');
});
//============================================boton atras
router.post('/atras', function(req, res){
res.render('./usuario_master/buscar_usuario', {session: req.session})
})

//===========================================buscar usuario
router.post('/buscar', function(req, res){

  models.Cargo.findOne({
    where: {cedula_personal: req.body.cedula} //buscamos un cargo asociado a una cedula
  })
  .then(function(Cargo){ // asignamos la busqueda a json Cargo
       if(Cargo==null){ // verificamo si la busqueda arrojo algun resultado de no ser asi procedemos a buscar el usuario
      //buscar personal con la cedula ingresada
            models.Personal.findOne({ where: {cedula: req.body.cedula}})
              //buscar unidad con el codigo_unidad que tiene el personal
               .then(function(Personal){models.Nucleo.findOne({ where: {codigo : Personal.codigo_nucleo } })
                //buscar nucleo al que pertenece la unidad con el codigo nucleo de unidad
                .then(function(Nucleo){models.Unidad.findOne({})
                  //buscamo cargos que no tengan cedulas en cedula_personal y que la unidad sea 3
                 .then(function(Unidad){models.Cargo.findAll({where:{cedula_personal: null,  codigo_unidad: '12'}})
                  ////pasamos los datos a la pantalla
                   .then(function(Cargo){

                    res.render('./usuario_master/crear-usuario-perfil-master-2',
                    {dataUnidad:Unidad, dataPersonal:Personal, dataNucleo:Nucleo, dataCargo:Cargo, session: req.session})
                  })
                   })
                    })

                    })   

          
  //cierre del primer if 
   } else{
res.render('./usuario_master/buscar_usuario', {error:'', session: req.session})
   }             


}) 
               })

     


  
//===================================================asignar usuario
  router.post('/asignar/:cedula', function(req, res){

    models.Cargo.findOne({

      where:  {codigo:req.body.cargo}


  })
    .then(function(Cargo){
       models.Cargo.update({
        cedula_personal: req.params.cedula
      },{
        where: {codigo:req.body.cargo}
      })
        res.render('./usuario_master/buscar_usuario' ,{exito:' hemos creado el usuario', session: req.session})
      })
      

    })
    
   /*===============================================================modificar usuario 
router.get('/modificar_usuario', function(req, res){

   models.Cargo.findAll({cedula_personal: {cedula_personal: null} })
     .then(function(Cargo1){
      models.Cargo.findAll({include: [models.Personal], where:{codigo_unidad:'3', cedula_personal:{[Op.ne]: null}}})
      .then(function(Cargo){
      models.Personal.findOne({})
      .then(function(Personal){

      res.render('./usuario_master/modificar-usuario-master', {dataCargo:Cargo, dataCargo1:Cargo1})
      })
   
     console.log(Cargo)
     })
   })

   });

//===================================================================modificar usuario pROBANDO
*/

router.get('/modificar_usuario', function(req, res){
console.log('estamos aqui')
      models.Cargo.findAll({ where:{codigo_unidad:'12', cedula_personal:{[Op.ne]: null }}})
      .then(function(Cargo){
console.log(Cargo)
        models.Cargo.findAll({ include: [models.Personal], where:{cedula_personal:{[Op.ne]: null }}
        })
        .then(function(Cargo1){
          console.log(Cargo1)
          console
          res.render('./usuario_master/modificar-usuario-master', {dataCargo:Cargo1, session: req.session})
        
        })
      
      })
   
    
     })
  
//================================================================================
router.post('/modificar', function(req, res){
   models.Personal.update({
    email: req.body.correo,
    tmovil: req.body.tmovil,
    thabitacion: req.body.thabitacion,
    direccion: req.body.direccion
   },{where: {cedula: req.body.cedula}})
.then(function(Personal){
   models.Cargo.findAll({include: [models.Personal], where:{codigo_unidad:'12', cedula_personal:{[Op.ne]: null}}})
     .then(function(Cargo){
      models.Personal.findOne({})
      .then(function(Personal){
      res.render('./usuario_master/modificar-usuario-master',{ dataCargo:Cargo, session: req.session})
      })
         })

})
})

//================================================================= eliminar usuario

router.get('/eliminar_usuario', function(req, res){
models.Cargo.findAll({include: [models.Personal], where:{codigo_unidad:'12', cedula_personal:{[Op.ne]: null}}})
     .then(function(Cargo){
      models.Personal.findOne({})
      .then(function(Personal){
      res.render('./usuario_master/eliminar-usuario-perfil-master',{ dataCargo:Cargo ,session: req.session})
      })
      
       })

})

router.get('/eliminar/:cedula_personal', function(req, res){
  models.Cargo.update({
cedula_personal: null
  },{where: {cedula_personal: req.params.cedula_personal}})
  .then(function(Cargo){

models.Cargo.findAll({include: [models.Personal], where:{codigo_unidad:'12', cedula_personal:{[Op.ne]: null}}})
     .then(function(Cargo){
      models.Personal.findOne({})
      .then(function(Personal){
      res.render('./usuario_master/eliminar-usuario-perfil-master',{ dataCargo:Cargo , session: req.session})
      })

})

     })



   })





module.exports = router;