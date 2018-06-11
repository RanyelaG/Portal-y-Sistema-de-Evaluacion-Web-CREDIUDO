let express = require('express') // instanciamos express
let router = express.Router() // llamamos al manejador de rutas de express
let models = require('../models/modelos')
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

router.use('/', function(req, res, next){
  if(req.session.hasOwnProperty('cedula')) {
   next();
     }else{
    models.Evaluacion.findOne({where: {tipo: 'administrativos'}})
    .then(function(Evaluacion){
      models.Evaluacion.findOne({where: {tipo:'centros'}})
      .then(function(Evaluacion1){
        models.Evento.findOne({
          order: [
            ['id', 'DESC']
          ]
        }).then(Evento => {
          res.render('index-web-principal-definitivo', {
            session: req.session, 
            dataEvaluacion:Evaluacion, 
            dataEvaluacion1:Evaluacion1,
            dataEvento:Evento
          })  
        })
         
               console.log('Administravos Evaluacion', Evaluacion)
               console.log(' Centros evaluacion', Evaluacion1)
      })
    })
}

});








router.post('/', function(req, res){

   models.Personal.findOne({ where: {cedula:req.session.cedula} })
  .then(function(Personal){
    models.Cargo.findOne({ where:{cedula_personal:req.session.cedula}})
    .then(function(Cargo){
      models.Cargo.findAll({include:[models.Personal], where:{codigo_unidad:Cargo.codigo_unidad, [Op.and]:{referencia:'subordinado', [Op.and]:{cedula_personal:{[Op.ne]: null }}} }})
       .then(function(Cargo1){
  
       models.Instrument.findOne({where:{id:req.body.id_instrumento}}) // aqui paso el instrumento desde la pantalla principal de usuario 
      .then(function(Instrument){
        models.Instrument_e.create({name:Instrument.name, category: Instrument.category, t_instrument: Instrument.t_instrument})// creamos la evaluacion
        
         .then(function(Instrument_e){
            models.Factor.findAll({include:[models.Item], where:{instrumentId: Instrument.id}})
             .then(function(Factor){ 
              console.log('los factores creados som========', Factor)
            res.render('./personal_udo/evaluacionpersonal', {session:req.session,dataCargo:Cargo1, dataPersonal:Personal,dataFactor:Factor, dataInstrument:Instrument})
              
              
            
}) }) }) }) }) }) })



router.post('/jefe', function(req, res){

   models.Personal.findOne({ where: {cedula:req.session.cedula} })
  .then(function(Personal){
    models.Cargo.findOne({ where:{cedula_personal:req.session.cedula}})
    .then(function(Cargo){
      models.Cargo.findAll({include:[models.Personal], where:{codigo_unidad:Cargo.codigo_unidad, [Op.and]:{referencia:'subordinado', [Op.and]:{cedula_personal:{[Op.ne]: null }}} }})
       .then(function(Cargo1){
  
       models.Instrument.findOne({where:{id:req.body.id_instrumento}}) // aqui paso el instrumento desde la pantalla principal de usuario 
      .then(function(Instrument){
        models.Instrument_e.create({name:Instrument.name, category: Instrument.category, t_instrument: Instrument.t_instrument})// creamos la evaluacion
        
         .then(function(Instrument_e){
            models.Factor.findAll({include:[models.Item], where:{instrumentId: Instrument.id}})
             .then(function(Factor){ 
              console.log('los factores creados som========', Factor)
            res.render('./personal_udo/evaluacionpersonal2', {session:req.session,dataCargo:Cargo1, dataPersonal:Personal,dataFactor:Factor, dataInstrument:Instrument})
              
              
            
}) }) }) }) }) }) })

























router.post('/finalizar', function(req, res){
  
var fecha= Date()
console.log('el codigo del instrumento es',req.body.instrumento)

models.Instrument.findOne({where:{id:req.body.instrumento}})
.then(function(Instrument){
console.log(' el instrumento encontrado es',Instrument )
 models.Instrument_e.create({name:Instrument.name, category: Instrument.category, t_instrument: Instrument.t_instrument})
 .then(function(Instrument_e){

models.Factor.findAll({include:[models.Item],
  where:{instrumentId:req.body.instrumento }
})
.then(function(Factor){

 console.log('los factores son===============',Factor )
     

     for(let i = 0; i < req.body.factor.length; i ++){
      console.log('el factor es ',req.body.factor[i])

models.Factor_e.create({nameFactor:req.body.factor[i], InstrumentEId: Instrument_e.id})
.then(function(Factor_e){

for(let z = 0; z < Factor[i].items.length; z ++) {
 ;

models.Item_e.create({name:Factor[i].items[z].name, calificacion:req.body['Item'+[i]+[z]], FactorEId:Factor_e.id})
}
})

}  
      
models.Examen.findOrCreate({
  where: {  PersonalCedula:req.session.cedula, 
          [Op.and]: {InstrumentEId:Instrument_e.id}},
  defaults: { PersonalCedula:req.session.cedula,
              nombre:Instrument_e.name,
            InstrumentEId:Instrument_e.id,
            tipo: Instrument_e.t_instrument,
            category: Instrument_e.category,
           fecha_examen:fecha }})
.then(function(Examen1){


  models.Examen.findOne({
  where:{id:Examen1[0].id}
})
.then(function(Examen){

models.Instrument_e.findOne({
 where:{id:Examen.InstrumentEId}
}).then(function(Instrument_e){
models.Factor_e.findAll({include:[models.Item_e], where:{InstrumentEId:Examen.InstrumentEId}})
.then(function(Factor_e){
    models.Item_e.findAll({
       where:{FactorEId:Factor_e.id}
    }).then(function(Item_e){

     
res.render('./personal_udo/reporte-personal-udo', {session:req.session,Examen:Examen,dataFactor:Factor_e, dataItem:Item_e})
})// fin then Item_e
})// fin then Factor_e
})// fin then Instrument_e
})// fin Then Examen


}) }) }) }) })



router.post('/finalizar_jefe', function(req, res){
  
var fecha= Date()
console.log('el codigo del instrumento es',req.body.instrumento)

models.Instrument.findOne({where:{id:req.body.instrumento}})
.then(function(Instrument){
console.log(' el instrumento encontrado es',Instrument )
 models.Instrument_e.create({name:Instrument.name, category: Instrument.category, t_instrument: Instrument.t_instrument})
 .then(function(Instrument_e){

models.Factor.findAll({include:[models.Item],
  where:{instrumentId:req.body.instrumento }
})
.then(function(Factor){

 console.log('los factores son===============',Factor )
     

     for(let i = 0; i < req.body.factor.length; i ++){
      console.log('el factor es ',req.body.factor[i])

models.Factor_e.create({nameFactor:req.body.factor[i], InstrumentEId: Instrument_e.id})
.then(function(Factor_e){

for(let z = 0; z < Factor[i].items.length; z ++) {
 ;

models.Item_e.create({name:Factor[i].items[z].name, calificacion:req.body['Item'+[i]+[z]], FactorEId:Factor_e.id})
}
})

}  
      
models.Examen.findOrCreate({
  where: {  PersonalCedula:req.session.cedula, 
          [Op.and]: {InstrumentEId:Instrument_e.id}},
  defaults: { PersonalCedula:req.session.cedula,
              nombre:Instrument_e.name,
            InstrumentEId:Instrument_e.id,
            tipo: Instrument_e.t_instrument,
            category: Instrument_e.category,
           fecha_examen:fecha }})
.then(function(Examen1){


  models.Examen.findOne({
  where:{id:Examen1[0].id}
})
.then(function(Examen){

models.Instrument_e.findOne({
 where:{id:Examen.InstrumentEId}
}).then(function(Instrument_e){
models.Factor_e.findAll({include:[models.Item_e], where:{InstrumentEId:Examen.InstrumentEId}})
.then(function(Factor_e){
    models.Item_e.findAll({
       where:{FactorEId:Factor_e.id}
    }).then(function(Item_e){

     
res.render('./personal_udo/reporte-personal-udo', {session:req.session,Examen:Examen,dataFactor:Factor_e, dataItem:Item_e})
})// fin then Item_e
})// fin then Factor_e
})// fin then Instrument_e
})// fin Then Examen


}) }) }) }) })






















module.exports = router;