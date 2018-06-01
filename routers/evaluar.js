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
         res.render('index-web-principal-definitivo', {session: req.session, dataEvaluacion:Evaluacion,dataEvaluacion1:Evaluacion1})
               console.log('Administravos Evaluacion', Evaluacion)
               console.log(' Centros evaluacion', Evaluacion1)
      })
    })
}

});

router.post('/', function(req, res){
console.log('estas en la evaluacion')
  models.Personal.findOne({ where: {cedula:req.session.cedula} })
  .then(function(Personal){
     models.Instrument.findOne({where:{id:req.body.id_instrumento}}) // aqui paso el instrumento desde la pantalla principal de usuario 
    	.then(function(Instrument){
        models.Instrument_e.create({name:Instrument.name, category: Instrument.category, t_instrument: Instrument.t_instrument})// creamos la evaluacion
        
         .then(function(Instrument_e){
            models.Factor.findAll({ where:{instrumentId: Instrument.id}})
             .then(function(Factor){ 
                models.Factor.findOne({})
	               .then(function(Factor1){ 
             
            models.Factor_e.create({nameFactor:Factor1.nameFactor, InstrumentEId: Instrument_e.id})// creamos factor de la Evaluacion
            .then(function(Factor_e){

	          models.Item.findOne({where:{factorId: Factor1.id}})
            .then(function(Item1){
              if(!Item1){res.render('./personal_udo/evaluacionpersonal', {inicio:'1', dataPersonal:Personal,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:null, dataItem_e1:null,  dataItem2:null, dataItem3:null, dataItem4:null, dataItem5:null, dataItem6:null, dataItem7:null, dataItem8:null, dataItem9:null, dataItem10:null,
              dataItem_e2:null, dataItem_e3:null, dataItem_e4:null, dataItem_e5:null, dataItem_e6:null , dataItem_e7:null, dataItem_e8:null, dataItem_e9:null, dataItem_e10:null})}
            

            models.Item_e.create({name: Item1.name, FactorEId:Factor_e.id})
            .then(function(Item_e1){
             
              models.Item.findOne({where:{factorId: Factor1.id, id:{[Op.ne]: Item1.id }}})
              .then(function(Item2){
              
              if(!Item2){res.render('./personal_udo/evaluacionpersonal', {inicio:'1', dataPersonal:Personal,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:Item1, dataItem_e1:Item_e1, dataItem2:null, dataItem3:null, dataItem4:null, dataItem5:null, dataItem6:null, dataItem7:null, dataItem8:null, dataItem9:null, dataItem10:null,
              dataItem_e2:null, dataItem_e3:null, dataItem_e4:null, dataItem_e5:null, dataItem_e6:null , dataItem_e7:null, dataItem_e8:null, dataItem_e9:null, dataItem_e10:null})}
              

              models.Item_e.create({name: Item2.name, FactorEId:Factor_e.id})
              .then(function(Item_e2){
               
                	models.Item.findOne({where:{factorId: Factor1.id, id:{[Op.notIn]: [Item1.id, Item2.id]}}})
                	 .then(function(Item3){

                    if(!Item3){res.render('./personal_udo/evaluacionpersonal', { inicio:'1',dataPersonal:Personal,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:Item1, dataItem_e1:Item_e1, dataItem2:Item2, dataItem3:null, dataItem4:null, dataItem5:null, dataItem6:null, dataItem7:null, dataItem8:null, dataItem9:null, dataItem10:null,
                    dataItem_e2:Item_e2, dataItem_e3:null, dataItem_e4:null, dataItem_e5:null, dataItem_e6:null , dataItem_e7:null, dataItem_e8:null, dataItem_e9:null, dataItem_e10:null})}
                   
                   	models.Item_e.create({name: Item3.name, FactorEId:Factor_e.id})
                    .then(function(Item_e3){

                     	models.Item.findOne({where:{factorId: Factor1.id, id:{[Op.notIn]: [Item1.id, Item2.id, Item3.id]}}})
                	 	.then(function(Item4){

                       if(!Item4){res.render('./personal_udo/evaluacionpersonal', {inicio:'1',dataPersonal:Personal,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:Item1,  dataItem_e1:Item_e1, dataItem2:Item2, dataItem3:Item3, dataItem4:null, dataItem5:null, dataItem6:null, dataItem7:null, dataItem8:null, dataItem9:null, dataItem10:null,
                            dataItem_e2:Item_e2, dataItem_e3:Item_e3, dataItem_e4:null, dataItem_e5:null, dataItem_e6:null , dataItem_e7:null, dataItem_e8:null, dataItem_e9:null, dataItem_e10:null})}
                           
                            models.Item_e.create({name: Item4.name, FactorEId:Factor_e.id})
                           .then(function(Item_e4){
                          
                            models.Item.findOne({where:{factorId: Factor1.id, id:{[Op.notIn]: [Item1.id, Item2.id, Item3.id,Item4.id]}}})
                	 		      .then(function(Item5){
                          
                               if(!Item5){res.render('./personal_udo/evaluacionpersonal', {inicio:'1',dataPersonal:Personal,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:Item1, dataItem_e1:Item_e1, dataItem2:Item2, dataItem3:Item3, dataItem4:Item4, dataItem5:null, dataItem6:null, dataItem7:null, dataItem8:null, dataItem9:null, dataItem10:null,
                               dataItem_e2:Item_e2, dataItem_e3:Item_e3, dataItem_e4:Item_e4, dataItem_e5:null, dataItem_e6:null , dataItem_e7:null, dataItem_e8:null, dataItem_e9:null, dataItem_e10:null})}
                               
                                models.Item_e.create({name: Item5.name, FactorEId:Factor_e.id})
                               .then(function(Item_e5){

                                models.Item.findOne({where:{factorId: Factor1.id, id:{[Op.notIn]: [Item1.id, Item2.id, Item3.id,Item4.id, Item5.id]}}})
                                 .then(function(Item6){
                          
                                   if(!Item6){res.render('./personal_udo/evaluacionpersonal', { inicio:'1',dataPersonal:Personal,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:Item1, dataItem_e1:Item_e1, dataItem2:Item2, dataItem3:Item3, dataItem4:Item4, dataItem5:Item5, dataItem6:null, dataItem7:null, dataItem8:null, dataItem9:null, dataItem10:null,
                                   dataItem_e2:Item_e2, dataItem_e3:Item_e3, dataItem_e4:Item_e4, dataItem_e5:Item_e5, dataItem_e6:null , dataItem_e7:null, dataItem_e8:null, dataItem_e9:null, dataItem_e10:null})}
                                     
                                      models.Item_e.create({name: Item6.name, FactorEId:Factor_e.id})
                                     .then(function(Item_e6){

                                      models.Item.findOne({where:{factorId: Factor1.id, id:{[Op.notIn]: [Item1.id, Item2.id, Item3.id,Item4.id, Item5.id, Item6.id]}}})
                                     .then(function(Item7){
                          
                                       if(!Item7){res.render('./personal_udo/evaluacionpersonal', { inicio:'1',dataPersonal:Personal,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:Item1, dataItem_e1:Item_e1, dataItem2:Item2, dataItem3:Item3, dataItem4:Item4, dataItem5:Item5, dataItem6:Item6, dataItem7:null, dataItem8:null, dataItem9:null, dataItem10:null,
                                       dataItem_e2:Item_e2, dataItem_e3:Item_e3, dataItem_e4:Item_e4, dataItem_e5:Item_e5, dataItem_e6:Item_e6 , dataItem_e7:null, dataItem_e8:null, dataItem_e9:null, dataItem_e10:null})}
                               	  	   
                                       models.Item_e.create({name: Item7.name, FactorEId:Factor_e.id})
                                      .then(function(Item_e7){

                                       models.Item.findOne({where:{factorId: Factor1.id, id:{[Op.notIn]: [Item1.id, Item2.id, Item3.id,Item4.id, Item5.id, Item6.id, Item7.id]}}})
                                       .then(function(Item8){
                          
                                       if(!Item8){res.render('./personal_udo/evaluacionpersonal', {inicio:'1',dataPersonal:Personal,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:Item1, dataItem_e1:Item_e1, dataItem2:Item2, dataItem3:Item3, dataItem4:Item4, dataItem5:Item5, dataItem6:Item6, dataItem7:Item7, dataItem8:null, dataItem9:null, dataItem10:null,
                                       dataItem_e2:Item_e2, dataItem_e3:Item_e3, dataItem_e4:Item_e4, dataItem_e5:Item_e5, dataItem_e6:Item_e6 , dataItem_e7:Item_e7, dataItem_e8:null, dataItem_e9:null, dataItem_e10:null})}
                               	  	   
                                          models.Item_e.create({name: Item8.name, FactorEId:Factor_e.id})
                                          .then(function(Item_e8){
                                          
                                          models.Item.findOne({where:{factorId: Factor1.id, id:{[Op.notIn]: [Item1.id, Item2.id, Item3.id,Item4.id, Item5.id, Item6.id, Item7.id, Item8.id]}}})
                                          .then(function(Item9){
                          
                                          	if(!Item9){res.render('./personal_udo/evaluacionpersonal', {inicio:'1',dataPersonal:Personal,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:Item1, dataItem_e1:Item_e1, dataItem2:Item2, dataItem3:Item3, dataItem4:Item4, dataItem5:Item5, dataItem6:Item6, dataItem7:Item7, dataItem8:Item8, dataItem9:null, dataItem10:null,
                                            dataItem_e2:Item_e2, dataItem_e3:Item_e3, dataItem_e4:Item_e4, dataItem_e5:Item_e5, dataItem_e6:Item_e6 , dataItem_e7:Item_e7, dataItem_e8:Item_e8, dataItem_e9:null, dataItem_e10:null})}
                               	  	        
                                              models.Item_e.create({name: Item9.name, FactorEId:Factor_e.id})
                                               .then(function(Item_e9){

                                              models.Item.findOne({where:{factorId: Factor1.id, id:{[Op.notIn]: [Item1.id, Item2.id, Item3.id,Item4.id, Item5.id, Item6.id, Item7.id, Item8.id, Item9.id]}}})
                                              .then(function(Item10){

                                              if(!Item10){res.render('./personal_udo/evaluacionpersonal', {inicio:'1',dataPersonal:Personal,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:Item1, dataItem_e1:Item_e1, dataItem2:Item2, dataItem3:Item3, dataItem4:Item4, dataItem5:Item5, dataItem6:Item6, dataItem7:Item7, dataItem8:Item8, dataItem9:Item9, dataItem10:null,
                                              dataItem_e2:Item_e2, dataItem_e3:Item_e3, dataItem_e4:Item_e4, dataItem_e5:Item_e5, dataItem_e6:Item_e6 , dataItem_e7:Item_e7, dataItem_e8:Item_e8, dataItem_e9:Item_e9, dataItem_e10:null})}
                                            
                                               models.Item_e.create({name: Item10.name, FactorEId:Factor_e.id})
                                               .then(function(Item_e10){
                                                
                                                res.render('./personal_udo/evaluacionpersonal', {inicio:'1',dataPersonal:Personal,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem_e1:Item_e1, dataItem:Item1, dataItem2:Item2, dataItem3:Item3, dataItem4:Item4, dataItem5:Item5, dataItem6:Item6 , dataItem7:Item7, dataItem8:Item8, dataItem9:Item9, dataItem10:Item10,
                                                dataItem_e2:Item_e2, dataItem_e3:Item_e3, dataItem_e4:Item_e4, dataItem_e5:Item_e5, dataItem_e6:Item_e6 , dataItem_e7:Item_e7, dataItem_e8:Item_e8, dataItem_e9:Item_e9, dataItem_e10:Item_e10})

 



}) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) })
 

router.post('/evaluar', function(req, res){



models.Item_e.update({calificacion:req.body.calificacion1},{where:{ id:req.body.Item_e1}})
models.Item_e.update({calificacion:req.body.calificacion2},{where:{ id:req.body.Item_e2}})
models.Item_e.update({calificacion:req.body.calificacion3},{where:{ id:req.body.Item_e3}})
models.Item_e.update({calificacion:req.body.calificacion4},{where:{ id:req.body.Item_e4}})
models.Item_e.update({calificacion:req.body.calificacion5},{where:{ id:req.body.Item_e5}})
models.Item_e.update({calificacion:req.body.calificacion6},{where:{ id:req.body.Item_e6}})
models.Item_e.update({calificacion:req.body.calificacion7},{where:{ id:req.body.Item_e7}})
models.Item_e.update({calificacion:req.body.calificacion8},{where:{ id:req.body.Item_e8}})
models.Item_e.update({calificacion:req.body.calificacion9},{where:{ id:req.body.Item_e9}})
models.Item_e.update({calificacion:req.body.calificacion10},{where:{ id:req.body.Item_e10}})
 

 models.Personal.findOne({ where: {cedula:req.session.cedula} })
  .then(function(Personal){

  models.Instrument.findOne({where:{id:req.body.dataInstrument}})
  .then(function(Instrument){
   
   models.Instrument_e.findOne({where:{id:req.body.dataInstrument_e}})
   .then(function(Instrument_e){
     

      models.Factor.findAll({ where:{instrumentId: Instrument.id}}) 
      .then(function(Factor){ 
        

         
          models.Factor.findOne({where:{id:req.body.factor}})
          .then(function(Factor1){
         console.log(' el Factor1 es =======================================', Factor1.id)
         
          models.Factor_e.findOrCreate({where: { nameFactor: Factor1.nameFactor, [Op.and]: {InstrumentEId:Instrument_e.id}}, defaults: {nameFactor:Factor1.nameFactor,FactorEId:Factor1.id, InstrumentEId:Instrument_e.id }})
          .then(function(Factor_e){
            models.Factor_e.findAll({where: {InstrumentEId:Instrument_e.id} })
            .then(function(Factor_e1){
          
          models.Item.findOne({where:{factorId: Factor1.id}})
          .then(function(Item1){
         
               if(!Item1){res.render('./personal_udo/evaluacionpersonal', {inicio:0,dataPersonal:Personal, dataFactor_e1:Factor_e1, dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:null, dataItem_e1:null,  dataItem2:null, dataItem3:null, dataItem4:null, dataItem5:null, dataItem6:null, dataItem7:null, dataItem8:null, dataItem9:null, dataItem10:null,
               dataItem_e2:null, dataItem_e3:null, dataItem_e4:null, dataItem_e5:null, dataItem_e6:null , dataItem_e7:null, dataItem_e8:null, dataItem_e9:null, dataItem_e10:null})}
               models.Item_e.findOrCreate({where: { name: Item1.name, [Op.and]: {FactorEId:Factor_e[0].id}}, defaults: {name:Item1.name,FactorEId:Factor_e[0].id, InstrumentEId:Instrument_e.id }})
                 .then(function(Item_e1){
               
                models.Item.findOne({where:{factorId: Factor1.id, id:{[Op.ne]: Item1.id }}})
                .then(function(Item2){
                
                 if(!Item2){res.render('./personal_udo/evaluacionpersonal', {inicio:0,dataPersonal:Personal,dataFactor_e1:Factor_e1,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:Item1, dataItem_e1:Item_e1[0], dataItem2:null, dataItem3:null, dataItem4:null, dataItem5:null, dataItem6:null, dataItem7:null, dataItem8:null, dataItem9:null, dataItem10:null,
                 dataItem_e2:null, dataItem_e3:null, dataItem_e4:null, dataItem_e5:null, dataItem_e6:null , dataItem_e7:null, dataItem_e8:null, dataItem_e9:null, dataItem_e10:null})}
                 models.Item_e.findOrCreate({where: { name: Item2.name, [Op.and]: {FactorEId:Factor_e[0].id}}, defaults: {name:Item2.name,FactorEId:Factor_e[0].id, InstrumentEId:Instrument_e.id }})
                  .then(function(Item_e2){

                models.Item.findOne({where:{factorId: Factor1.id, id:{[Op.notIn]: [Item1.id, Item2.id]}}})
                   .then(function(Item3){
                
                     if(!Item3){res.render('./personal_udo/evaluacionpersonal', {inicio:0,dataPersonal:Personal,dataFactor_e1:Factor_e1,dataFactor_e1:Factor_e1,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:Item1, dataItem_e1:Item_e1[0], dataItem2:Item2, dataItem3:null, dataItem4:null, dataItem5:null, dataItem6:null, dataItem7:null, dataItem8:null, dataItem9:null, dataItem10:null,
                     dataItem_e2:Item_e2[0], dataItem_e3:null, dataItem_e4:null, dataItem_e5:null, dataItem_e6:null , dataItem_e7:null, dataItem_e8:null, dataItem_e9:null, dataItem_e10:null})}
                    
                     models.Item_e.findOrCreate({where: { name: Item3.name, [Op.and]: {FactorEId:Factor_e[0].id}}, defaults: {name:Item3.name,FactorEId:Factor_e[0].id, InstrumentEId:Instrument_e.id }})
                       .then(function(Item_e3){

                      models.Item.findOne({where:{factorId: Factor1.id, id:{[Op.notIn]: [Item1.id, Item2.id, Item3.id]}}})
                     .then(function(Item4){
                
                           if(!Item4){res.render('./personal_udo/evaluacionpersonal', {inicio:0,dataPersonal:Personal,dataFactor_e1:Factor_e1,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:Item1,  dataItem_e1:Item_e1[0], dataItem2:Item2, dataItem3:Item3, dataItem4:null, dataItem5:null, dataItem6:null, dataItem7:null, dataItem8:null, dataItem9:null, dataItem10:null,
                            dataItem_e2:Item_e2[0], dataItem_e3:Item_e3[0], dataItem_e4:null, dataItem_e5:null, dataItem_e6:null , dataItem_e7:null, dataItem_e8:null, dataItem_e9:null, dataItem_e10:null})}
                           
                            models.Item_e.findOrCreate({where: { name: Item4.name, [Op.and]: {FactorEId:Factor_e[0].id}}, defaults: {name:Item4.name,FactorEId:Factor_e[0].id, InstrumentEId:Instrument_e.id }})
                            .then(function(Item_e4){

                            models.Item.findOne({where:{factorId: Factor1.id, id:{[Op.notIn]: [Item1.id, Item2.id, Item3.id,Item4.id]}}})
                            .then(function(Item5){
                
                              if(!Item5){res.render('./personal_udo/evaluacionpersonal', {inicio:0,dataPersonal:Personal,dataFactor_e1:Factor_e1,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:Item1, dataItem_e1:Item_e1[0], dataItem2:Item2, dataItem3:Item3, dataItem4:Item4, dataItem5:null, dataItem6:null, dataItem7:null, dataItem8:null, dataItem9:null, dataItem10:null,
                               dataItem_e2:Item_e2[0], dataItem_e3:Item_e3[0], dataItem_e4:Item_e4[0], dataItem_e5:null, dataItem_e6:null , dataItem_e7:null, dataItem_e8:null, dataItem_e9:null, dataItem_e10:null})}
                              
                               models.Item_e.findOrCreate({where: { name: Item5.name, [Op.and]: {FactorEId:Factor_e[0].id}}, defaults: {name:Item5.name,FactorEId:Factor_e[0].id, InstrumentEId:Instrument_e.id }})
                               .then(function(Item_e5){

                                models.Item.findOne({where:{factorId: Factor1.id, id:{[Op.notIn]: [Item1.id, Item2.id, Item3.id,Item4.id, Item5.id]}}})
                               .then(function(Item6){
                
                                 if(!Item6){res.render('./personal_udo/evaluacionpersonal', {inicio:0,dataPersonal:Personal,dataFactor_e1:Factor_e1,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:Item1, dataItem_e1:Item_e1[0], dataItem2:Item2, dataItem3:Item3, dataItem4:Item4, dataItem5:Item5, dataItem6:null, dataItem7:null, dataItem8:null, dataItem9:null, dataItem10:null,
                                   dataItem_e2:Item_e2[0], dataItem_e3:Item_e3[0], dataItem_e4:Item_e4[0], dataItem_e5:Item_e5[0], dataItem_e6:null , dataItem_e7:null, dataItem_e8:null, dataItem_e9:null, dataItem_e10:null})}
                                 
                                    models.Item_e.findOrCreate({where: { name: Item6.name, [Op.and]: {FactorEId:Factor_e[0].id}}, defaults: {name:Item6.name,FactorEId:Factor_e[0].id, InstrumentEId:Instrument_e.id }})
                                    .then(function(Item_e6){
                                 
                                    models.Item.findOne({where:{factorId: Factor1.id, id:{[Op.notIn]: [Item1.id, Item2.id, Item3.id,Item4.id, Item5.id, Item6.id]}}})
                                    .then(function(Item7){
                
                                       if(!Item7){res.render('./personal_udo/evaluacionpersonal', {inicio:0,dataPersonal:Personal,dataFactor_e1:Factor_e1,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:Item1, dataItem_e1:Item_e1[0], dataItem2:Item2, dataItem3:Item3, dataItem4:Item4, dataItem5:Item5, dataItem6:Item6, dataItem7:null, dataItem8:null, dataItem9:null, dataItem10:null,
                                       dataItem_e2:Item_e2[0], dataItem_e3:Item_e3[0], dataItem_e4:Item_e4[0], dataItem_e5:Item_e5[0], dataItem_e6:Item_e6[0] , dataItem_e7:null, dataItem_e8:null, dataItem_e9:null, dataItem_e10:null})}
                                    
                                       models.Item_e.findOrCreate({where: { name: Item7.name, [Op.and]: {FactorEId:Factor_e[0].id}}, defaults: {name:Item7.name,FactorEId:Factor_e[0].id, InstrumentEId:Instrument_e.id }})
                                       .then(function(Item_e7){

                                      models.Item.findOne({where:{factorId: Factor1.id, id:{[Op.notIn]: [Item1.id, Item2.id, Item3.id,Item4.id, Item5.id, Item6.id, Item7.id]}}})
                                      .then(function(Item8){
                
                                       if(!Item8){res.render('./personal_udo/evaluacionpersonal', {inicio:0,dataPersonal:Personal,dataFactor_e1:Factor_e1,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:Item1, dataItem_e1:Item_e1[0], dataItem2:Item2, dataItem3:Item3, dataItem4:Item4, dataItem5:Item5, dataItem6:Item6, dataItem7:Item7, dataItem8:null, dataItem9:null, dataItem10:null,
                                       dataItem_e2:Item_e2[0], dataItem_e3:Item_e3[0], dataItem_e4:Item_e4[0], dataItem_e5:Item_e5[0], dataItem_e6:Item_e6[0] , dataItem_e7:Item_e7[0], dataItem_e8:null, dataItem_e9:null, dataItem_e10:null})}
                                       
                                        models.Item_e.findOrCreate({where: { name: Item8.name, [Op.and]: {FactorEId:Factor_e[0].id}}, defaults: {name:Item8.name,FactorEId:Factor_e[0].id, InstrumentEId:Instrument_e.id }})
                                         .then(function(Item_e8){

                                        models.Item.findOne({where:{factorId: Factor1.id, id:{[Op.notIn]: [Item1.id, Item2.id, Item3.id,Item4.id, Item5.id, Item6.id, Item7.id, Item8.id]}}})
                                        .then(function(Item9){
                                            
                                            if(!Item9){res.render('./personal_udo/evaluacionpersonal', {inicio:0,dataPersonal:Personal,dataFactor_e1:Factor_e1,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:Item1, dataItem_e1:Item_e1[0], dataItem2:Item2, dataItem3:Item3, dataItem4:Item4, dataItem5:Item5, dataItem6:Item6, dataItem7:Item7, dataItem8:Item8, dataItem9:null, dataItem10:null,
                                            dataItem_e2:Item_e2[0], dataItem_e3:Item_e3[0], dataItem_e4:Item_e4[0], dataItem_e5:Item_e5[0], dataItem_e6:Item_e6[0] , dataItem_e7:Item_e7[0], dataItem_e8:Item_e8[0], dataItem_e9:null, dataItem_e10:null})}
                                            

                                              models.Item_e.findOrCreate({where: { name: Item9.name, [Op.and]: {dataPersonal:Personal,FactorEId:Factor_e[0].id}}, defaults: {name:Item9.name,FactorEId:Factor_e[0].id, InstrumentEId:Instrument_e.id }})
                                               .then(function(Item_e9){

                                              models.Item.findOne({where:{factorId: Factor1.id, id:{[Op.notIn]: [Item1.id, Item2.id, Item3.id,Item4.id, Item5.id, Item6.id, Item7.id, Item8.id, Item9.id]}}})
                                              .then(function(Item10){

                                              if(!Item10){res.render('./personal_udo/evaluacionpersonal', {inicio:0,dataPersonal:Personal,dataFactor_e1:Factor_e1,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:Item1, dataItem_e1:Item_e1[0], dataItem2:Item2, dataItem3:Item3, dataItem4:Item4, dataItem5:Item5, dataItem6:Item6, dataItem7:Item7, dataItem8:Item8, dataItem9:Item9, dataItem10:null,
                                              dataItem_e2:Item_e2[0], dataItem_e3:Item_e3[0], dataItem_e4:Item_e4[0], dataItem_e5:Item_e5[0], dataItem_e6:Item_e6[0] , dataItem_e7:Item_e7[0], dataItem_e8:Item_e8[0], dataItem_e9:Item_e9[0], dataItem_e10:null})}
                                            
                                                  models.Item_e.findOrCreate({where: { name: Item10.name, [Op.and]: {FactorEId:Factor_e[0].id}}, defaults: {name:Item10.name,FactorEId:Factor_e[0].id, InstrumentEId:Instrument_e.id }})
                                                 .then(function(Item_e10){
                                            
                                                 if(!Item10){res.render('./personal_udo/evaluacionpersonal', {inicio:0,dataPersonal:Personal,dataFactor_e1:Factor_e1,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem:Item1, dataItem_e1:Item_e1[0], dataItem2:Item2, dataItem3:Item3, dataItem4:Item4, dataItem5:Item5, dataItem6:Item6, dataItem7:Item7, dataItem8:Item8, dataItem9:Item9, dataItem10:null,
                                              dataItem_e2:Item_e2[0], dataItem_e3:Item_e3[0], dataItem_e4:Item_e4[0], dataItem_e5:Item_e5[0], dataItem_e6:Item_e6[0] , dataItem_e7:Item_e7[0], dataItem_e8:Item_e8[0], dataItem_e9:Item_e9[0], dataItem_e10:null})}
                                            
                                                res.render('./personal_udo/evaluacionpersonal', {inicio:0,dataPersonal:Personal,dataFactor_e1:Factor_e1,dataFactor:Factor, dataFactor1:Factor1, dataInstrument_e:Instrument_e, dataInstrument:Instrument, dataItem_e1:Item_e1[0], dataItem:Item1, dataItem2:Item2, dataItem3:Item3, dataItem4:Item4, dataItem5:Item5, dataItem6:Item6 , dataItem7:Item7, dataItem8:Item8, dataItem9:Item9, dataItem10:Item10,
                                               dataItem_e2:Item_e2[0], dataItem_e3:Item_e3[0], dataItem_e4:Item_e4[0], dataItem_e5:Item_e5[0], dataItem_e6:Item_e6[0] , dataItem_e7:Item_e7[0], dataItem_e8:Item_e8[0], dataItem_e9:Item_e9[0], dataItem_e10:Item_e10[0]})




}) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) })


router.post('/finalizar', function(req, res){
 

 models.Examen.create({
  PersonalCedula:req.body.cedula,
  InstrumentEId:req.body.id_instrument_e
   })

})





module.exports = router;