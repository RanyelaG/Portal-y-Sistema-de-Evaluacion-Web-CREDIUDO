var express = require('express');
var router = express.Router();
var models = require('../models/modelos')


router.get('/', function(req, res){
  //models.Personal.findAll().then(function(Personal){
     res.render('buscar_usuario'/*, {dataPersonal:Personal}*/)
  //});
//res.render('Crear-usuario-perfil-master');
});

router.post('/atras', function(req, res){
res.render('buscar_usuario')
})

// Buscar Usuario
router.post('/buscar', function(req, res){

  models.Cargo.findOne({
    where: {cedula_personal: req.body.cedula} //buscamos un cargo asociado a una cedula
  })
  .then(function(Cargo){ // asignamos la busqueda a json Cargo
       if(Cargo==null){ // verificamo si la busqueda arrojo algun resultado de no ser asi procedemos a buscar el usuario
      //buscar personal con la cedula ingresada
            models.Personal.findOne({ where: {cedula: req.body.cedula}})
              //buscar unidad con el codigo_unidad que tiene el personal
               .then(function(Personal){models.Unidad.findOne({ where: {codigo : Personal.codigo_unidad } })
                //buscar nucleo al que pertenece la unidad con el codigo nucleo de unidad
                .then(function(Unidad){models.Nucleo.findOne({ where: {codigo : Unidad.codigo_nucleo} })
                  //buscamo cargos que no tengan cedulas en cedula_personal y que la unidad sea 3
                 .then(function(Nucleo){models.Cargo.findAll({where:{cedula_personal: null,  codigo_unidad: '12'} })
                  ////pasamos los datos a la pantalla
                   .then(function(Cargo){

                    res.render('crear-usuario-perfil-master-2',
                    {dataUnidad:Unidad, dataPersonal:Personal, dataNucleo:Nucleo, dataCargo:Cargo})
                  })
                   })
                    })

                    })   

          
  //cierre del primer if 
   } else{
res.render('buscar_usuario', {error:''})
   }             


}) // fin del catch
               })

     


  

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
        res.render('./buscar_usuario' ,{exito:' hemos creado el usuario'})
      })
      
    })
    
    
 
 
   

  


router.post('/add', (req, res)=>{
  models.Personal.create({
      cedula: req.body.cedula,
    nombre: req.body.nombre,
    cargo: req.body.cargo
// fin primer then(personal)

  })
})

module.exports = router;