let express = require('express') // instanciamos express
let router = express.Router() // llamamos al manejador de rutas de express
let models = require('../models/modelos') // requerimos al modelos user en la carpeta usuario
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
               
               
            })
        })
}

});

router.get('/',function(req, res){




// buscamos cargos unidad y mostramos los botones de pertencer a un nucle la evaluacion o unidad
models.Cargo.findOne({where:{cedula_personal:req.session.cedula}})// buscamos el cargo que tiene el personal logueado
  .then(function(Cargo){
  	models.Unidad.findOne({where:{codigo: Cargo.codigo_unidad}})// buscamos a unidad a la que pertnece ese cargo asociado
  	 .then(function(Unidad){ 

  	   var fecha= new Date();
  	   models.Evaluacion.findOne({	where: {codigo_unidad: Unidad.codigo_nucleo,[Op.and]: { inicio:{[Op.lte]:fecha}, [Op.and]:{fin: {[Op.gte]:fecha}}} /* hasta aqui la fecha y hora */}})// verificamos que la unidad de a evaluacion sea el nucleo de la unidad del personal
	   
	    .then(function(Evaluacion){
	    	if(Evaluacion){// primer si es un nucleo if
	  		
	  		if(Cargo.referencia =='coordinador'){ // tengo que llamar es a instrumento
 				 
 				  models.Instrument.findOne({  // buscamos el intrumenyo tipo eval_sub para la categoria pers_admin
                 		where: {t_instrument: 'aut_eval_jefe', 
                 			[Op.and]: {category:'cent_inves'}}
                    })
                 	.then(function(Instrument){
	  			 	if(Instrument){// si encontramos instrumento tipo eval_jef  

                         
	  			 		models.Instrument.findOne({// buscamos el intrumenyo tipo aut_eval para la categoria cen_inves
	  			 			where: {t_instrument: 'aut_eval_jefe', 
	  			 				[Op.and]: {category:'cent_inves'}}
	  			 		})
	  			 		.then(function(Instrument1){

	  			 			models.Evaluacion.findOne({
	  			 				where: {codigo_unidad: Unidad.codigo_nucleo, 
	  			 					[Op.and]: {tipo:'centros', 
	  			 					[Op.and]: {enfoque:'Jefe-Subordinado',
	  			 					[Op.and]: { inicio:{[Op.lte]:fecha}, 
	  			 					[Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion){// 1
                           
                        if(Evaluacion){ 

                        models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'cent_inves', 
                        		[Op.and]: {tipo:'eval_jef',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen){console.log('el examennnnn es ===============================', Examen)

                    if(!Examen){
                    	console.log('estas en el !examen=======================')

                            models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, 
                            	[Op.and]: {tipo:'centros', 
                            	[Op.and]: {enfoque:'Auto-Jefe',
                            	[Op.and]: { inicio:{[Op.lte]:fecha}, 
                            	[Op.and]:{fin: {[Op.gte]:fecha}} }  }}}
	  			 			})
	  			 			.then(function(Evaluacion1){

	  			 			models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'cent_inves', 
                        		[Op.and]: {tipo:'aut_eval_jefe',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen1){console.log('el examennnnn1 es ===============================', Examen1)

                        if(!Examen1){
                        	console.log('esta en el examen1===============')

	  			 				models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:Evaluacion, 
                             		     Eva_jefe:Instrument, 
                             		     Eva_sub:null, 
                             		     Eva_auto:Evaluacion1,
                             		     sub_jefe:null, 
                             		     auto:Instrument1})
	  			 			
	  			 			})//fin del then(Nucleo)
	  			 		}else{

	  			 			//aqui va la ejecucion del codigo si hay evaluacion 1
	  			 			models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:Evaluacion, 
                             		     Eva_auto:null,
                             		     sub_jefe:Instrument, 
                             		     auto:null})
	  			 			
	  			 			})//fin del then(Nucleo)

	  			 		}// fin del if-else()

	  			 		})//fin del then(Examen1)
                        }) //fin del then(Evaluacion1)
	  			 	}else{ //else !examen     

    						models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, 
                            	[Op.and]: {tipo:'centros', 
                            	[Op.and]: {enfoque:'Auto-Jefe',
                            	[Op.and]: { inicio:{[Op.lte]:fecha}, 
                            	[Op.and]:{fin: {[Op.gte]:fecha}} }  }}}
	  			 			})
	  			 			.then(function(Evaluacion1){

	  			 			models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'cent_inves', 
                        		[Op.and]: {tipo:'aut_eval_jefe',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen1){console.log('el examennnnn1 es ===============================', Examen1)

                        if(!Examen1){
                        	console.log('esta en el examen1 del else ===============')

	  			 				models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:null, 
                             		     Eva_auto:Evaluacion1,
                             		     sub_jefe:null, 
                             		     auto:Instrument1})
	  			 			
	  			 			})//fin del then(Nucleo)
	  			 		}else{

	  			 			//aqui va la ejecucion del codigo si hay evaluacion 1
	  			 			models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:null, 
                             		     Eva_auto:null,
                             		     sub_jefe:null, 
                             		     auto:null})
	  			 			
	  			 			})//fin del then(Nucleo)

	  			 		}// fin del if-else()

	  			 		})//fin del then(Examen1)
                        }) //fin del then(Evaluacion1)

	  			 			}//fin del if-else(!examen)
	  			 			})// fin del then(examen)

	  			 		}else{
                            console.log(' estas en este else=================================2')
                            models.Evaluacion.findOne({
                           		where: {codigo_unidad: Unidad.codigo_nucleo, 
                           			[Op.and]: {tipo:'centros' , 
                           			[Op.and]: {enfoque:'Auto-Jefe',
                           			[Op.and]: { inicio:{[Op.lte]:fecha}, 
                           			[Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		Nucleo:Nucleo, 
                             		Unidad:Unidad, 
                             		jefe_sub:null, 
                             		Eva_jefe:null, 
                             		Eva_sub:null, 
                             		Eva_auto:Evaluacion1, 
                             		sub_jefe:Instrument, 
                             		auto:Instrument1})
	  			 			})
                            })

                        } //fin del if else evaluacion

	  			 				console.log('la evaluacion es', Evaluacion )
	  			 			})// fin del then(evaluacion) 1
	  			 			
	  			 		})// fin del then(instrument1)

	  			 	}else{ // si no encontramos instrumento tipo eval_je lo declaramos null y buscamos el intrumenyo tipo aut_eval para la categoria pers_admin 
	  			 		
	  			 		console.log(' estas en este else=================================1')
	  			 		models.Instrument.findOne({
	  			 			where: {t_instrument: 'aut_eval_jefe', [Op.and]: {category:'cent_inves'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, [Op.and]: {tipo:'centros' , [Op.and]: {enfoque:'Auto-Jefe',[Op.and]: { inicio:{[Op.lte]:fecha}, [Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
	  			 		res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:null, sub_jefe:null, Eva_auto:Evaluacion1, auto:Instrument1})
	  			 			}) 
	  			 		})
	  			 		})
	  			 	} // fin del if else instrument
	  			 })
	  			

	            
            	

	  		}else if(Cargo.referencia == 'jefe'){
	  			

   						 models.Instrument.findOne({  // buscamos el intrumenyo tipo eval_sub para la categoria pers_admin
                 		where: {t_instrument: 'eval_jef', 
                 			[Op.and]: {category:'pers_admin'}}
                    })
                 	.then(function(Instrument){
	  			 	if(Instrument){// si encontramos instrumento tipo eval_jef  

                         
	  			 		models.Instrument.findOne({// buscamos el intrumenyo tipo aut_eval para la categoria pers_admin
	  			 			where: {t_instrument: 'aut_eval_jefe', 
	  			 				[Op.and]: {category:'pers_admin'}}
	  			 		})
	  			 		.then(function(Instrument1){

	  			 			models.Evaluacion.findOne({
	  			 				where: {codigo_unidad: Unidad.codigo_nucleo, 
	  			 					[Op.and]: {tipo:'administrativos', 
	  			 					[Op.and]: {enfoque:'Jefe-Subordinado',
	  			 					[Op.and]: { inicio:{[Op.lte]:fecha}, 
	  			 					[Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion){// 1
                           
                        if(Evaluacion){ 

                        models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'pers_admin', 
                        		[Op.and]: {tipo:'eval_jef',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen){console.log('el examennnnn es ===============================', Examen)

                    if(!Examen){
                    	console.log('estas en el !examen=======================')

                            models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, 
                            	[Op.and]: {tipo:'administrativos', 
                            	[Op.and]: {enfoque:'Auto-Jefe',
                            	[Op.and]: { inicio:{[Op.lte]:fecha}, 
                            	[Op.and]:{fin: {[Op.gte]:fecha}} }  }}}
	  			 			})
	  			 			.then(function(Evaluacion1){

	  			 			models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'pers_admin', 
                        		[Op.and]: {tipo:'aut_eval_jefe',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen1){console.log('el examennnnn1 aqui en Nuc es ===============================', Examen1)

                        if(!Examen1){
                        	console.log('esta en el examen1===============')

	  			 				models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:Instrument, 
                             		     Eva_jefe:Evaluacion, 
                             		     Eva_sub:null, 
                             		     Eva_auto:Evaluacion1,
                             		     sub_jefe:null, 
                             		     auto:Instrument1})
	  			 			
	  			 			})//fin del then(Nucleo)
	  			 		}else{

	  			 			//aqui va la ejecucion del codigo si hay evaluacion 1
	  			 			models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:Instrument, 
                             		     Eva_jefe:Evaluacion, 
                             		     Eva_sub:null, 
                             		     Eva_auto:null,
                             		     sub_jefe:null, 
                             		     auto:null})
	  			 			
	  			 			})//fin del then(Nucleo)

	  			 		}// fin del if-else()

	  			 		})//fin del then(Examen1)
                        }) //fin del then(Evaluacion1)
	  			 	}else{ //else !examen     

    						models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, 
                            	[Op.and]: {tipo:'administrativos', 
                            	[Op.and]: {enfoque:'Auto-Jefe',
                            	[Op.and]: { inicio:{[Op.lte]:fecha}, 
                            	[Op.and]:{fin: {[Op.gte]:fecha}} }  }}}
	  			 			})
	  			 			.then(function(Evaluacion1){

	  			 			models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'pers_admin', 
                        		[Op.and]: {tipo:'aut_eval_jefe',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen1){console.log('el examennnnn1 es ===============================', Examen1)

                        if(!Examen1){
                        	console.log('esta en el examen1 del else ===============')

	  			 				models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:null, 
                             		     Eva_auto:Evaluacion1,
                             		     sub_jefe:null, 
                             		     auto:Instrument1})
	  			 			
	  			 			})//fin del then(Nucleo)
	  			 		}else{

	  			 			//aqui va la ejecucion del codigo si hay evaluacion 1
	  			 			models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:null, 
                             		     Eva_auto:null,
                             		     sub_jefe:null, 
                             		     auto:null})
	  			 			
	  			 			})//fin del then(Nucleo)

	  			 		}// fin del if-else()

	  			 		})//fin del then(Examen1)
                        }) //fin del then(Evaluacion1)

	  			 			}//fin del if-else(!examen)
	  			 			})// fin del then(examen)

	  			 		}else{
                            
                            models.Evaluacion.findOne({
                           		where: {codigo_unidad: Unidad.codigo_nucleo, 
                           			[Op.and]: {tipo:'administrativos' , 
                           			[Op.and]: {enfoque:'Auto-Jefe',
                           			[Op.and]: { inicio:{[Op.lte]:fecha}, 
                           			[Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		Nucleo:Nucleo, 
                             		Unidad:Unidad, 
                             		jefe_sub:null, 
                             		Eva_jefe:null, 
                             		Eva_sub:null, 
                             		Eva_auto:Evaluacion1, 
                             		sub_jefe:Instrument, 
                             		auto:Instrument1})
	  			 			})
                            })

                        } //fin del if else evaluacion

	  			 				console.log('la evaluacion es', Evaluacion )
	  			 			})// fin del then(evaluacion) 1
	  			 			
	  			 		})// fin del then(instrument1)

	  			 	}else{ // si no encontramos instrumento tipo eval_je lo declaramos null y buscamos el intrumenyo tipo aut_eval para la categoria pers_admin 
	  			 	console.log(' estas en este else=================================1')	
	  			 		models.Instrument.findOne({
	  			 			where: {t_instrument: 'aut_eval_jefe', [Op.and]: {category:'pers_admin'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, [Op.and]: {tipo:'administrativos' , [Op.and]: {enfoque:'Auto-Jefe',[Op.and]: { inicio:{[Op.lte]:fecha}, [Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
	  			 		res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:null, sub_jefe:null, Eva_auto:Evaluacion1, auto:Instrument1})
	  			 			}) 
	  			 		})
	  			 		})
	  			 	} // fin del if else instrument
	  			 })
                


	  		 }else if(Cargo.referencia == 'subordinado'){
//=====================================================Subordinado==================================
				  	    models.Instrument.findOne({  // buscamos el intrumenyo tipo eval_sub para la categoria pers_admin
                 		where: {t_instrument: 'eval_sub', 
                 			[Op.and]: {category:'pers_admin'}}
                    })
                 	.then(function(Instrument){
	  			 	if(Instrument){// si encontramos instrumento tipo eval_jef  

                         
	  			 		models.Instrument.findOne({// buscamos el intrumenyo tipo aut_eval para la categoria pers_admin
	  			 			where: {t_instrument: 'aut_eval_sub', 
	  			 				[Op.and]: {category:'pers_admin'}}
	  			 		})
	  			 		.then(function(Instrument1){

	  			 			models.Evaluacion.findOne({
	  			 				where: {codigo_unidad: Unidad.codigo_nucleo, 
	  			 					[Op.and]: {tipo:'administrativos', 
	  			 					[Op.and]: {enfoque:'Subordinado-Jefe',
	  			 					[Op.and]: { inicio:{[Op.lte]:fecha}, 
	  			 					[Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion){// 1
                           
                        if(Evaluacion){ 

                        models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'pers_admin', 
                        		[Op.and]: {tipo:'eval_sub',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen){console.log('el examennnnn es ===============================', Examen)

                    if(!Examen){
                    	console.log('estas en el !examen=======================')

                            models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, 
                            	[Op.and]: {tipo:'administrativos', 
                            	[Op.and]: {enfoque:'Auto-Subordinado',
                            	[Op.and]: { inicio:{[Op.lte]:fecha}, 
                            	[Op.and]:{fin: {[Op.gte]:fecha}} }  }}}
	  			 			})
	  			 			.then(function(Evaluacion1){

	  			 			models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'pers_admin', 
                        		[Op.and]: {tipo:'aut_eval_sub',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen1){console.log('el examennnnn1 es ===============================', Examen1)

                        if(!Examen1){
                        	console.log('esta en el examen1===============')

	  			 				models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:Evaluacion, 
                             		     Eva_auto:Evaluacion1,
                             		     sub_jefe:Instrument, 
                             		     auto:Instrument1})
	  			 			
	  			 			})//fin del then(Nucleo)
	  			 		}else{

	  			 			//aqui va la ejecucion del codigo si hay evaluacion 1
	  			 			models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:Evaluacion, 
                             		     Eva_auto:null,
                             		     sub_jefe:Instrument, 
                             		     auto:null})
	  			 			
	  			 			})//fin del then(Nucleo)

	  			 		}// fin del if-else()

	  			 		})//fin del then(Examen1)
                        }) //fin del then(Evaluacion1)
	  			 	}else{ //else !examen     

    						models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, 
                            	[Op.and]: {tipo:'administrativos', 
                            	[Op.and]: {enfoque:'Auto-Subordinado',
                            	[Op.and]: { inicio:{[Op.lte]:fecha}, 
                            	[Op.and]:{fin: {[Op.gte]:fecha}} }  }}}
	  			 			})
	  			 			.then(function(Evaluacion1){

	  			 			models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'pers_admin', 
                        		[Op.and]: {tipo:'aut_eval_sub',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen1){console.log('el examennnnn1 es ===============================', Examen1)

                        if(!Examen1){
                        	console.log('esta en el examen1 del else ===============')

	  			 				models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:null, 
                             		     Eva_auto:Evaluacion1,
                             		     sub_jefe:null, 
                             		     auto:Instrument1})
	  			 			
	  			 			})//fin del then(Nucleo)
	  			 		}else{

	  			 			//aqui va la ejecucion del codigo si hay evaluacion 1
	  			 			models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:null, 
                             		     Eva_auto:null,
                             		     sub_jefe:null, 
                             		     auto:null})
	  			 			
	  			 			})//fin del then(Nucleo)

	  			 		}// fin del if-else()

	  			 		})//fin del then(Examen1)
                        }) //fin del then(Evaluacion1)

	  			 			}//fin del if-else(!examen)
	  			 			})// fin del then(examen)

	  			 		}else{
                            console.log(' estas en este else=================================2')
                            models.Evaluacion.findOne({
                           		where: {codigo_unidad: Unidad.codigo_nucleo, 
                           			[Op.and]: {tipo:'administrativos' , 
                           			[Op.and]: {enfoque:'Auto-Subordinado',
                           			[Op.and]: { inicio:{[Op.lte]:fecha}, 
                           			[Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		Nucleo:Nucleo, 
                             		Unidad:Unidad, 
                             		jefe_sub:null, 
                             		Eva_jefe:null, 
                             		Eva_sub:null, 
                             		Eva_auto:Evaluacion1, 
                             		sub_jefe:Instrument, 
                             		auto:Instrument1})
	  			 			})
                            })

                        } //fin del if else evaluacion

	  			 				console.log('la evaluacion es', Evaluacion )
	  			 			})// fin del then(evaluacion) 1
	  			 			
	  			 		})// fin del then(instrument1)

	  			 	}else{ // si no encontramos instrumento tipo eval_je lo declaramos null y buscamos el intrumenyo tipo aut_eval para la categoria pers_admin 
	  			 		
	  			 		console.log(' estas en este else=================================1')
	  			 		models.Instrument.findOne({
	  			 			where: {t_instrument: 'aut_eval_sub', [Op.and]: {category:'pers_admin'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, [Op.and]: {tipo:'administrativos' , [Op.and]: {enfoque:'Auto-Subordinado',[Op.and]: { inicio:{[Op.lte]:fecha}, [Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
	  			 		res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:null, sub_jefe:null, Eva_auto:Evaluacion1, auto:Instrument1})
	  			 			}) 
	  			 		})
	  			 		})
	  			 	} // fin del if else instrument
	  			 })
                
                
            }else if(Cargo.referencia == 'investigador'){
            	  models.Instrument.findOne({  // buscamos el intrumenyo tipo eval_sub para la categoria pers_admin
                 		where: {t_instrument: 'eval_sub', 
                 			[Op.and]: {category:'cent_inves'}}
                    })
                 	.then(function(Instrument){
	  			 	if(Instrument){// si encontramos instrumento tipo eval_jef  

                         
	  			 		models.Instrument.findOne({// buscamos el intrumenyo tipo aut_eval para la categoria pers_admin
	  			 			where: {t_instrument: 'aut_eval_sub', 
	  			 				[Op.and]: {category:'cent_inves'}}
	  			 		})
	  			 		.then(function(Instrument1){

	  			 			models.Evaluacion.findOne({
	  			 				where: {codigo_unidad: Unidad.codigo_nucleo, 
	  			 					[Op.and]: {tipo:'centros', 
	  			 					[Op.and]: {enfoque:'Subordinado-Jefe',
	  			 					[Op.and]: { inicio:{[Op.lte]:fecha}, 
	  			 					[Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion){// 1
                           
                        if(Evaluacion){ 

                        models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'cent_inves', 
                        		[Op.and]: {tipo:'aut_eval_sub',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen){console.log('el examennnnn es ===============================', Examen)

                    if(!Examen){
                    	console.log('estas en el !examen=======================')

                            models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, 
                            	[Op.and]: {tipo:'centros', 
                            	[Op.and]: {enfoque:'Auto-Subordinado',
                            	[Op.and]: { inicio:{[Op.lte]:fecha}, 
                            	[Op.and]:{fin: {[Op.gte]:fecha}} }  }}}
	  			 			})
	  			 			.then(function(Evaluacion1){

	  			 			models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'cent_inves', 
                        		[Op.and]: {tipo:'aut_eval_sub',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen1){console.log('el examennnnn1 es ===============================', Examen1)

                        if(!Examen1){
                        	console.log('esta en el examen1===============')

	  			 				models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:Evaluacion, 
                             		     Eva_auto:Evaluacion1,
                             		     sub_jefe:Instrument, 
                             		     auto:Instrument1})
	  			 			
	  			 			})//fin del then(Nucleo)
	  			 		}else{

	  			 			//aqui va la ejecucion del codigo si hay evaluacion 1
	  			 			models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:Evaluacion, 
                             		     Eva_auto:null,
                             		     sub_jefe:Instrument, 
                             		     auto:null})
	  			 			
	  			 			})//fin del then(Nucleo)

	  			 		}// fin del if-else()

	  			 		})//fin del then(Examen1)
                        }) //fin del then(Evaluacion1)
	  			 	}else{ //else !examen     

    						models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, 
                            	[Op.and]: {tipo:'centros', 
                            	[Op.and]: {enfoque:'Auto-Subordinado',
                            	[Op.and]: { inicio:{[Op.lte]:fecha}, 
                            	[Op.and]:{fin: {[Op.gte]:fecha}} }  }}}
	  			 			})
	  			 			.then(function(Evaluacion1){

	  			 			models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'cent_inves', 
                        		[Op.and]: {tipo:'aut_eval_sub',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen1){console.log('el examennnnn1 es ===============================', Examen1)

                        if(!Examen1){
                        	console.log('esta en el examen1 del else ===============')

	  			 				models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:null, 
                             		     Eva_auto:Evaluacion1,
                             		     sub_jefe:null, 
                             		     auto:Instrument1})
	  			 			
	  			 			})//fin del then(Nucleo)
	  			 		}else{

	  			 			//aqui va la ejecucion del codigo si hay evaluacion 1
	  			 			models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:null, 
                             		     Eva_auto:null,
                             		     sub_jefe:null, 
                             		     auto:null})
	  			 			
	  			 			})//fin del then(Nucleo)

	  			 		}// fin del if-else()

	  			 		})//fin del then(Examen1)
                        }) //fin del then(Evaluacion1)

	  			 			}//fin del if-else(!examen)
	  			 			})// fin del then(examen)

	  			 		}else{
                            console.log(' estas en este else=================================2')
                            models.Evaluacion.findOne({
                           		where: {codigo_unidad: Unidad.codigo_nucleo, 
                           			[Op.and]: {tipo:'centros' , 
                           			[Op.and]: {enfoque:'Auto-Subordinado',
                           			[Op.and]: { inicio:{[Op.lte]:fecha}, 
                           			[Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		Nucleo:Nucleo, 
                             		Unidad:Unidad, 
                             		jefe_sub:null, 
                             		Eva_jefe:null, 
                             		Eva_sub:null, 
                             		Eva_auto:Evaluacion1, 
                             		sub_jefe:Instrument, 
                             		auto:Instrument1})
	  			 			})
                            })

                        } //fin del if else evaluacion

	  			 				console.log('la evaluacion es', Evaluacion )
	  			 			})// fin del then(evaluacion) 1
	  			 			
	  			 		})// fin del then(instrument1)

	  			 	}else{ // si no encontramos instrumento tipo eval_je lo declaramos null y buscamos el intrumenyo tipo aut_eval para la categoria pers_admin 
	  			 		
	  			 		console.log(' estas en este else=================================1')
	  			 		models.Instrument.findOne({
	  			 			where: {t_instrument: 'aut_eval_sub', [Op.and]: {category:'cent_inves'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, [Op.and]: {tipo:'centros' , [Op.and]: {enfoque:'Auto-Subordinado',[Op.and]: { inicio:{[Op.lte]:fecha}, [Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
	  			 		res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:null, sub_jefe:null, Eva_auto:Evaluacion1, auto:Instrument1})
	  			 			}) 
	  			 		})
	  			 		})
	  			 	} // fin del if else instrument
	  			 })
	  			

	  			 } // aqui termina el if

            	
             // termina tu



	  	}else{
//========================================================================================//	  		
//	  		//de no ser una nucleo osea es una unidad empezamos desde aqui				  //
//																					      //
//                                                                                        //
//                                                                                        //
//                                                                                        //
//========================================================================================//
console.log('estas en el else==========================================================================')

	  models.Evaluacion.findOne({where: {codigo_unidad: Cargo.codigo_unidad,[Op.and]: { inicio:{[Op.lte]:fecha}, [Op.and]:{fin: {[Op.gte]:fecha}}}/*Aqui termina */}})
	  .then(function(Evaluacion){console.log('el codigo de la unidad a evaluar es',Evaluacion)
	  	console.log('la unidad de la evaluacion=============================',Unidad )
	  	if(Evaluacion){// segundo if si es una unidad
	  		console.log('es una unidad estasssss aqui===============================================')
	  		
	  		if(Cargo.referencia =='coordinador'){ 


 				  models.Instrument.findOne({  // buscamos el intrumenyo tipo eval_sub para la categoria pers_admin
                 		where: {t_instrument: 'eval_jef', 
                 			[Op.and]: {category:'cent_inves'}}
                    })
                 	.then(function(Instrument){
	  			 	if(Instrument){// si encontramos instrumento tipo eval_jef  

                         
	  			 		models.Instrument.findOne({// buscamos el intrumenyo tipo aut_eval para la categoria pers_admin
	  			 			where: {t_instrument: 'aut_eval_jefe', 
	  			 				[Op.and]: {category:'cent_inves'}}
	  			 		})
	  			 		.then(function(Instrument1){

	  			 			models.Evaluacion.findOne({
	  			 				where: {codigo_unidad: Cargo.codigo_unidad, 
	  			 					[Op.and]: {tipo:'centros', 
	  			 					[Op.and]: {enfoque:'Jefe-Subordinado',
	  			 					[Op.and]: { inicio:{[Op.lte]:fecha}, 
	  			 					[Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion){// 1
                           
                        if(Evaluacion){ 

                        models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'cent_inves', 
                        		[Op.and]: {tipo:'eval_jef',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen){console.log('el examennnnn es ===============================', Examen)

                    if(!Examen){
                    	console.log('estas en el !examen=======================')

                            models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, 
                            	[Op.and]: {tipo:'centros', 
                            	[Op.and]: {enfoque:'Auto-Jefe',
                            	[Op.and]: { inicio:{[Op.lte]:fecha}, 
                            	[Op.and]:{fin: {[Op.gte]:fecha}} }  }}}
	  			 			})
	  			 			.then(function(Evaluacion1){

	  			 			models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'cent_inves', 
                        		[Op.and]: {tipo:'aut_eval_jefe',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen1){console.log('el examennnnn1 es ===============================', Examen1)

                        if(!Examen1){
                        	console.log('esta en el examen1===============')

	  			 				models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:Evaluacion, 
                             		     Eva_jefe:Instrument, 
                             		     Eva_sub:null, 
                             		     Eva_auto:Evaluacion1,
                             		     sub_jefe:null, 
                             		     auto:Instrument1})
	  			 			
	  			 			})//fin del then(Nucleo)
	  			 		}else{

	  			 			//aqui va la ejecucion del codigo si hay evaluacion 1
	  			 			models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:Evaluacion, 
                             		     Eva_auto:null,
                             		     sub_jefe:Instrument, 
                             		     auto:null})
	  			 			
	  			 			})//fin del then(Nucleo)

	  			 		}// fin del if-else()

	  			 		})//fin del then(Examen1)
                        }) //fin del then(Evaluacion1)
	  			 	}else{ //else !examen     

    						models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, 
                            	[Op.and]: {tipo:'centros', 
                            	[Op.and]: {enfoque:'Auto-Jefe',
                            	[Op.and]: { inicio:{[Op.lte]:fecha}, 
                            	[Op.and]:{fin: {[Op.gte]:fecha}} }  }}}
	  			 			})
	  			 			.then(function(Evaluacion1){

	  			 			models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'cent_inves', 
                        		[Op.and]: {tipo:'aut_eval_jefe',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen1){console.log('el examennnnn1 es ===============================', Examen1)

                        if(!Examen1){
                        	console.log('esta en el examen1 del else ===============')

	  			 				models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:null, 
                             		     Eva_auto:Evaluacion1,
                             		     sub_jefe:null, 
                             		     auto:Instrument1})
	  			 			
	  			 			})//fin del then(Nucleo)
	  			 		}else{

	  			 			//aqui va la ejecucion del codigo si hay evaluacion 1
	  			 			models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:null, 
                             		     Eva_auto:null,
                             		     sub_jefe:null, 
                             		     auto:null})
	  			 			
	  			 			})//fin del then(Nucleo)

	  			 		}// fin del if-else()

	  			 		})//fin del then(Examen1)
                        }) //fin del then(Evaluacion1)

	  			 			}//fin del if-else(!examen)
	  			 			})// fin del then(examen)

	  			 		}else{
                            console.log(' estas en este else=================================2')
                            models.Evaluacion.findOne({
                           		where: {codigo_unidad: Cargo.codigo_unidad, 
                           			[Op.and]: {tipo:'centros' , 
                           			[Op.and]: {enfoque:'Auto-Jefe',
                           			[Op.and]: { inicio:{[Op.lte]:fecha}, 
                           			[Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		Nucleo:Nucleo, 
                             		Unidad:Unidad, 
                             		jefe_sub:null, 
                             		Eva_jefe:null, 
                             		Eva_sub:null, 
                             		Eva_auto:Evaluacion1, 
                             		sub_jefe:Instrument, 
                             		auto:Instrument1})
	  			 			})
                            })

                        } //fin del if else evaluacion

	  			 				console.log('la evaluacion es', Evaluacion )
	  			 			})// fin del then(evaluacion) 1
	  			 			
	  			 		})// fin del then(instrument1)

	  			 	}else{ // si no encontramos instrumento tipo eval_je lo declaramos null y buscamos el intrumenyo tipo aut_eval para la categoria pers_admin 
	  			 		
	  			 		console.log(' estas en este else=================================1')
	  			 		models.Instrument.findOne({
	  			 			where: {t_instrument: 'aut_eval_jefe', [Op.and]: {category:'cent_inves'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, [Op.and]: {tipo:'centros' , [Op.and]: {enfoque:'Auto-Jefe',[Op.and]: { inicio:{[Op.lte]:fecha}, [Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
	  			 		res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:null, sub_jefe:null, Eva_auto:Evaluacion1, auto:Instrument1})
	  			 			}) 
	  			 		})
	  			 		})
	  			 	} // fin del if else instrument
	  			 })
	  			

	            



	  		// tengo que llamar es a instrumento
 				


	  		}else if(Cargo.referencia == 'jefe'){
	  			 models.Instrument.findOne({  // buscamos el intrumenyo tipo eval_sub para la categoria pers_admin
                 		where: {t_instrument: 'eval_jef', 
                 			[Op.and]: {category:'pers_admin'}}
                    })
                 	.then(function(Instrument){
	  			 	if(Instrument){// si encontramos instrumento tipo eval_jef  

                         
	  			 		models.Instrument.findOne({// buscamos el intrumenyo tipo aut_eval para la categoria pers_admin
	  			 			where: {t_instrument: 'aut_eval_jefe', 
	  			 				[Op.and]: {category:'pers_admin'}}
	  			 		})
	  			 		.then(function(Instrument1){

	  			 			models.Evaluacion.findOne({
	  			 				where: {codigo_unidad: Cargo.codigo_unidad, 
	  			 					[Op.and]: {tipo:'administrativos', 
	  			 					[Op.and]: {enfoque:'Jefe-Subordinado',
	  			 					[Op.and]: { inicio:{[Op.lte]:fecha}, 
	  			 					[Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion){// 1
                           
                        if(Evaluacion){ 

                        models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'pers_admin', 
                        		[Op.and]: {tipo:'eval_jef',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen){console.log('el examennnnn es ===============================', Examen)

                    if(!Examen){
                    	console.log('estas en el !examen=======================')

                            models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, 
                            	[Op.and]: {tipo:'administrativos', 
                            	[Op.and]: {enfoque:'Auto-Jefe',
                            	[Op.and]: { inicio:{[Op.lte]:fecha}, 
                            	[Op.and]:{fin: {[Op.gte]:fecha}} }  }}}
	  			 			})
	  			 			.then(function(Evaluacion1){

	  			 			models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'pers_admin', 
                        		[Op.and]: {tipo:'aut_eval_jefe',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen1){console.log('el examennnnn1 estas aqui chamacon es ===============================', Examen1)

                        if(!Examen1){
                        	console.log('esta en el examen1===============')

	  			 				models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:Instrument, 
                             		     Eva_jefe:Evaluacion, 
                             		     Eva_sub:null, 
                             		     Eva_auto:Evaluacion1,
                             		     sub_jefe:null, 
                             		     auto:Instrument1})
	  			 			
	  			 			})//fin del then(Nucleo)
	  			 		}else{

	  			 			//aqui va la ejecucion del codigo si hay evaluacion 1
	  			 			models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:Instrument, 
                             		     Eva_jefe:Evaluacion, 
                             		     Eva_sub:null, 
                             		     Eva_auto:null,
                             		     sub_jefe:null, 
                             		     auto:null})
	  			 			
	  			 			})//fin del then(Nucleo)

	  			 		}// fin del if-else()

	  			 		})//fin del then(Examen1)
                        }) //fin del then(Evaluacion1)
	  			 	}else{ //else !examen     

    						models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, 
                            	[Op.and]: {tipo:'administrativos', 
                            	[Op.and]: {enfoque:'Auto-Jefe',
                            	[Op.and]: { inicio:{[Op.lte]:fecha}, 
                            	[Op.and]:{fin: {[Op.gte]:fecha}} }  }}}
	  			 			})
	  			 			.then(function(Evaluacion1){

	  			 			models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'pers_admin', 
                        		[Op.and]: {tipo:'aut_eval_jefe',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen1){console.log('el examennnnn1 es  estas aqui en unidad jefe===============================', Examen1)

                        if(!Examen1){
                        	console.log('esta en el examen1 del else ===============')

	  			 				models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:null, 
                             		     Eva_auto:Evaluacion1,
                             		     sub_jefe:null, 
                             		     auto:Instrument1})
	  			 			
	  			 			})//fin del then(Nucleo)
	  			 		}else{

	  			 			//aqui va la ejecucion del codigo si hay evaluacion 1
	  			 			models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:null, 
                             		     Eva_auto:null,
                             		     sub_jefe:null, 
                             		     auto:null})
	  			 			
	  			 			})//fin del then(Nucleo)

	  			 		}// fin del if-else()

	  			 		})//fin del then(Examen1)
                        }) //fin del then(Evaluacion1)

	  			 			}//fin del if-else(!examen)
	  			 			})// fin del then(examen)

	  			 		}else{
                            
                            models.Evaluacion.findOne({
                           		where: {codigo_unidad: Cargo.codigo_unidad, 
                           			[Op.and]: {tipo:'administrativos' , 
                           			[Op.and]: {enfoque:'Auto-Jefe',
                           			[Op.and]: { inicio:{[Op.lte]:fecha}, 
                           			[Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		Nucleo:Nucleo, 
                             		Unidad:Unidad, 
                             		jefe_sub:null, 
                             		Eva_jefe:null, 
                             		Eva_sub:null, 
                             		Eva_auto:Evaluacion1, 
                             		sub_jefe:Instrument, 
                             		auto:Instrument1})
	  			 			})
                            })

                        } //fin del if else evaluacion

	  			 				console.log('la evaluacion es', Evaluacion )
	  			 			})// fin del then(evaluacion) 1
	  			 			
	  			 		})// fin del then(instrument1)

	  			 	}else{ // si no encontramos instrumento tipo eval_je lo declaramos null y buscamos el intrumenyo tipo aut_eval para la categoria pers_admin 
	  			 	console.log(' estas en este else=================================1')	
	  			 		models.Instrument.findOne({
	  			 			where: {t_instrument: 'aut_eval_jefe', [Op.and]: {category:'pers_admin'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, [Op.and]: {tipo:'administrativos' , [Op.and]: {enfoque:'Auto-Jefe',[Op.and]: { inicio:{[Op.lte]:fecha}, [Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
	  			 		res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:null, sub_jefe:null, Eva_auto:Evaluacion1, auto:Instrument1})
	  			 			}) 
	  			 		})
	  			 		})
	  			 	} // fin del if else instrument
	  			 })




	  		 }else if(Cargo.referencia == 'subordinado'){

	  		 	 models.Instrument.findOne({  // buscamos el intrumenyo tipo eval_sub para la categoria pers_admin
                 		where: {t_instrument: 'eval_sub', 
                 			[Op.and]: {category:'pers_admin'}}
                    })
                 	.then(function(Instrument){
	  			 	if(Instrument){// si encontramos instrumento tipo eval_jef  

                         
	  			 		models.Instrument.findOne({// buscamos el intrumenyo tipo aut_eval para la categoria pers_admin
	  			 			where: {t_instrument: 'aut_eval_sub', 
	  			 				[Op.and]: {category:'pers_admin'}}
	  			 		})
	  			 		.then(function(Instrument1){

	  			 			models.Evaluacion.findOne({
	  			 				where: {codigo_unidad: Cargo.codigo_unidad, 
	  			 					[Op.and]: {tipo:'administrativos', 
	  			 					[Op.and]: {enfoque:'Subordinado-Jefe',
	  			 					[Op.and]: { inicio:{[Op.lte]:fecha}, 
	  			 					[Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion){// 1
                           
                        if(Evaluacion){ 

                        models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'pers_admin', 
                        		[Op.and]: {tipo:'eval_sub',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen){console.log('el examennnnn es ===============================', Examen)

                    if(!Examen){
                    	console.log('estas en el !examen=======================')

                            models.Evaluacion.findOne({
                            where: {codigo_unidad:Cargo.codigo_unidad, 
                            	[Op.and]: {tipo:'administrativos', 
                            	[Op.and]: {enfoque:'Auto-Subordinado',
                            	[Op.and]: { inicio:{[Op.lte]:fecha}, 
                            	[Op.and]:{fin: {[Op.gte]:fecha}} }  }}}
	  			 			})
	  			 			.then(function(Evaluacion1){

	  			 			models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'pers_admin', 
                        		[Op.and]: {tipo:'aut_eval_sub',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen1){console.log('el examennnnn1 es ===============================', Examen1)

                        if(!Examen1){
                        	console.log('esta en el examen1===============')

	  			 				models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:Evaluacion, 
                             		     Eva_auto:Evaluacion1,
                             		     sub_jefe:Instrument, 
                             		     auto:Instrument1})
	  			 			
	  			 			})//fin del then(Nucleo)
	  			 		}else{

	  			 			//aqui va la ejecucion del codigo si hay evaluacion 1
	  			 			models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:Evaluacion, 
                             		     Eva_auto:null,
                             		     sub_jefe:Instrument, 
                             		     auto:null})
	  			 			
	  			 			})//fin del then(Nucleo)

	  			 		}// fin del if-else()

	  			 		})//fin del then(Examen1)
                        }) //fin del then(Evaluacion1)
	  			 	}else{ //else !examen     

    						models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, 
                            	[Op.and]: {tipo:'administrativos', 
                            	[Op.and]: {enfoque:'Auto-Subordinado',
                            	[Op.and]: { inicio:{[Op.lte]:fecha}, 
                            	[Op.and]:{fin: {[Op.gte]:fecha}} }  }}}
	  			 			})
	  			 			.then(function(Evaluacion1){

	  			 			models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'pers_admin', 
                        		[Op.and]: {tipo:'aut_eval_sub',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen1){console.log('el examennnnn1 es estas aqui en unidad ===============================', Examen1)

                        if(!Examen1){
                        	console.log('esta en el examen1 del else ===============')

	  			 				models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:null, 
                             		     Eva_auto:Evaluacion1,
                             		     sub_jefe:null, 
                             		     auto:Instrument1})
	  			 			
	  			 			})//fin del then(Nucleo)
	  			 		}else{

	  			 			//aqui va la ejecucion del codigo si hay evaluacion 1
	  			 			models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:null, 
                             		     Eva_auto:null,
                             		     sub_jefe:null, 
                             		     auto:null})
	  			 			
	  			 			})//fin del then(Nucleo)

	  			 		}// fin del if-else()

	  			 		})//fin del then(Examen1)
                        }) //fin del then(Evaluacion1)

	  			 			}//fin del if-else(!examen)
	  			 			})// fin del then(examen)

	  			 		}else{
                            console.log(' estas en este else=================================2')
                            models.Evaluacion.findOne({
                           		where: {codigo_unidad: Cargo.codigo_unidad, 
                           			[Op.and]: {tipo:'administrativos' , 
                           			[Op.and]: {enfoque:'Auto-Subordinado',
                           			[Op.and]: { inicio:{[Op.lte]:fecha}, 
                           			[Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		Nucleo:Nucleo, 
                             		Unidad:Unidad, 
                             		jefe_sub:null, 
                             		Eva_jefe:null, 
                             		Eva_sub:null, 
                             		Eva_auto:Evaluacion1, 
                             		sub_jefe:Instrument, 
                             		auto:Instrument1})
	  			 			})
                            })

                        } //fin del if else evaluacion

	  			 				console.log('la evaluacion es', Evaluacion )
	  			 			})// fin del then(evaluacion) 1
	  			 			
	  			 		})// fin del then(instrument1)

	  			 	}else{ // si no encontramos instrumento tipo eval_je lo declaramos null y buscamos el intrumenyo tipo aut_eval para la categoria pers_admin 
	  			 		
	  			 		console.log(' estas en este else=================================1')
	  			 		models.Instrument.findOne({
	  			 			where: {t_instrument: 'aut_eval_sub', [Op.and]: {category:'pers_admin'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, [Op.and]: {tipo:'administrativos' , [Op.and]: {enfoque:'Auto-Subordinado',[Op.and]: { inicio:{[Op.lte]:fecha}, [Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
	  			 		res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:null, sub_jefe:null, Eva_auto:Evaluacion1, auto:Instrument1})
	  			 			}) 
	  			 		})
	  			 		})
	  			 	} // fin del if else instrument
	  			 })
                

                
            }else if(Cargo.referencia == 'investigador'){

            	 models.Instrument.findOne({  // buscamos el intrumenyo tipo eval_sub para la categoria pers_admin
                 		where: {t_instrument: 'eval_sub', 
                 			[Op.and]: {category:'cent_inves'}}
                    })
                 	.then(function(Instrument){
	  			 	if(Instrument){// si encontramos instrumento tipo eval_jef  

                         
	  			 		models.Instrument.findOne({// buscamos el intrumenyo tipo aut_eval para la categoria pers_admin
	  			 			where: {t_instrument: 'aut_eval_sub', 
	  			 				[Op.and]: {category:'cent_inves'}}
	  			 		})
	  			 		.then(function(Instrument1){

	  			 			models.Evaluacion.findOne({
	  			 				where: {codigo_unidad: Cargo.codigo_unidad, 
	  			 					[Op.and]: {tipo:'centros', 
	  			 					[Op.and]: {enfoque:'Subordinado-Jefe',
	  			 					[Op.and]: { inicio:{[Op.lte]:fecha}, 
	  			 					[Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion){// 1
                           
                        if(Evaluacion){ 

                        models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'cent_inves', 
                        		[Op.and]: {tipo:'eval_sub',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen){console.log('el examennnnn es ===============================', Examen)

                    if(!Examen){
                    	console.log('estas en el !examen=======================')

                            models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, 
                            	[Op.and]: {tipo:'centros', 
                            	[Op.and]: {enfoque:'Auto-Subordinado',
                            	[Op.and]: { inicio:{[Op.lte]:fecha}, 
                            	[Op.and]:{fin: {[Op.gte]:fecha}} }  }}}
	  			 			})
	  			 			.then(function(Evaluacion1){

	  			 			models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'cent_inves', 
                        		[Op.and]: {tipo:'aut_eval_sub',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen1){console.log('el examennnnn1 es ===============================', Examen1)

                        if(!Examen1){
                        	console.log('esta en el examen1===============')

	  			 				models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:Evaluacion, 
                             		     Eva_auto:Evaluacion1,
                             		     sub_jefe:Instrument, 
                             		     auto:Instrument1})
	  			 			
	  			 			})//fin del then(Nucleo)
	  			 		}else{

	  			 			//aqui va la ejecucion del codigo si hay evaluacion 1
	  			 			models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:Evaluacion, 
                             		     Eva_auto:null,
                             		     sub_jefe:Instrument, 
                             		     auto:null})
	  			 			
	  			 			})//fin del then(Nucleo)

	  			 		}// fin del if-else()

	  			 		})//fin del then(Examen1)
                        }) //fin del then(Evaluacion1)
	  			 	}else{ //else !examen     

    						models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, 
                            	[Op.and]: {tipo:'centros', 
                            	[Op.and]: {enfoque:'Auto-Subordinado',
                            	[Op.and]: { inicio:{[Op.lte]:fecha}, 
                            	[Op.and]:{fin: {[Op.gte]:fecha}} }  }}}
	  			 			})
	  			 			.then(function(Evaluacion1){

	  			 			models.Examen.findOne({
                        	where:{PersonalCedula: req.session.cedula,
                        	 	[Op.and]: {category:'cent_inves', 
                        		[Op.and]: {tipo:'aut_eval_sub',
                        	 	[Op.and]: {fecha_examen:{[Op.gte]:Evaluacion.inicio}, 
                        	 	[Op.and]:{fecha_examen: {[Op.lte]:Evaluacion.fin}}}}}}
                        }).then(function(Examen1){console.log('el examennnnn1 es ===============================', Examen1)

                        if(!Examen1){
                        	console.log('esta en el examen1 del else ===============')

	  			 				models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:null, 
                             		     Eva_auto:Evaluacion1,
                             		     sub_jefe:null, 
                             		     auto:Instrument1})
	  			 			
	  			 			})//fin del then(Nucleo)
	  			 		}else{

	  			 			//aqui va la ejecucion del codigo si hay evaluacion 1
	  			 			models.Nucleo.findOne({
	  			 					where:{codigo:Unidad.codigo_nucleo }
	  			 				})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		     Nucleo:Nucleo, 
                             		     Unidad:Unidad, 
                             		     jefe_sub:null, 
                             		     Eva_jefe:null, 
                             		     Eva_sub:null, 
                             		     Eva_auto:null,
                             		     sub_jefe:null, 
                             		     auto:null})
	  			 			
	  			 			})//fin del then(Nucleo)

	  			 		}// fin del if-else()

	  			 		})//fin del then(Examen1)
                        }) //fin del then(Evaluacion1)

	  			 			}//fin del if-else(!examen)
	  			 			})// fin del then(examen)

	  			 		}else{
                            console.log(' estas en este else=================================2')
                            models.Evaluacion.findOne({
                           		where: {codigo_unidad:Cargo.codigo_unidad, 
                           			[Op.and]: {tipo:'centros' , 
                           			[Op.and]: {enfoque:'Auto-Subordinado',
                           			[Op.and]: { inicio:{[Op.lte]:fecha}, 
                           			[Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", 
                             	{session:req.session,
                             		Nucleo:Nucleo, 
                             		Unidad:Unidad, 
                             		jefe_sub:null, 
                             		Eva_jefe:null, 
                             		Eva_sub:null, 
                             		Eva_auto:Evaluacion1, 
                             		sub_jefe:Instrument, 
                             		auto:Instrument1})
	  			 			})
                            })

                        } //fin del if else evaluacion

	  			 				console.log('la evaluacion es', Evaluacion )
	  			 			})// fin del then(evaluacion) 1
	  			 			
	  			 		})// fin del then(instrument1)

	  			 	}else{ // si no encontramos instrumento tipo eval_je lo declaramos null y buscamos el intrumenyo tipo aut_eval para la categoria pers_admin 
	  			 		
	  			 		console.log(' estas en este else=================================1')
	  			 		models.Instrument.findOne({
	  			 			where: {t_instrument: 'aut_eval_sub', [Op.and]: {category:'cent_inves'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, [Op.and]: {tipo:'centros' , [Op.and]: {enfoque:'Auto-Subordinado',[Op.and]: { inicio:{[Op.lte]:fecha}, [Op.and]:{fin: {[Op.gte]:fecha}}}}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
	  			 		res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:null, sub_jefe:null, Eva_auto:Evaluacion1, auto:Instrument1})
	  			 			}) 
	  			 		})
	  			 		})
	  			 	} // fin del if else instrument
	  			 })
	  			
           

	  		 }// termina aqui
	  







	  	}else{
	  	models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
	  res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:null, sub_jefe:null, Eva_auto:null, auto:null})
      })
	}})
	
	 }})//Evaluacion	
})//unidad	  
})//cargo

// aqui listamos las diferentes opciones de evaluacion para los distintos tipos de personal.


})//router

router.get('/historial', function(req, res){
models.Cargo.findOne({where:{cedula_personal:req.session.cedula}})
.then(function(Cargo){

if(Cargo.referencia=='subordinado'){
	 models.Examen.findAll({where:{PersonalCedula:req.session.cedula, [Op.and]:{tipo:{[Op.ne]:'eval_jef'}}}, order: [['fecha_examen','DESC']]})
       .then(function(Examen1){
       res.render('./personal_udo/historial-eva-personal-udo',{session:req.session,Examen1:Examen1} )})
   }else if(Cargo.referencia=='jefe'){
    models.Cargo.findAll({ where:{codigo_unidad:Cargo.codigo_unidad, [Op.and]:{cedula_personal:{[Op.ne]:null}}  }})
    .then(function(Cargo1){

   

    models.Examen.findAll({where:{PersonalCedula:req.session.cedula}, order: [['fecha_examen','DESC']]})
       .then(function(Examen1){
        console.log('estas en el historial de evaluacion de jefe')
       res.render('./personal_udo/historial-eva-personal-udo',{session:req.session,Examen1:Examen1} )})

        })
   }else if(Cargo.referencia=='coordinador'){
   models.Examen.findAll({where:{PersonalCedula:req.session.cedula, [Op.and]:{tipo:{[Op.ne]:'eval_sub'}}}, order: [['fecha_examen','DESC']]})
       .then(function(Examen1){
       res.render('./personal_udo/historial-eva-personal-udo',{session:req.session,Examen1:Examen1} )})

   }else if(Cargo.referencia=='investigador'){
    models.Examen.findAll({where:{PersonalCedula:req.session.cedula, [Op.and]:{tipo:{[Op.ne]:'eval_jef'}}}, order: [['fecha_examen','DESC']]})
       .then(function(Examen1){
       res.render('./personal_udo/historial-eva-personal-udo',{session:req.session,Examen1:Examen1} )})
  

   }

})	
      
})

router.get('/reporte_usuario/:id', function(req, res){

models.Examen.findOne({
	where:{id:req.params.id}
})
.then(function(Examen){

models.Instrument_e.findOne({
 where:{id:Examen.InstrumentEId}
}).then(function(Instrument_e){
models.Factor_e.findAll({include:[models.Item_e], where:{InstrumentEId:Examen.InstrumentEId}})
.then(function(Factor_e){
     var promedio=0;
      for(let i = 0; i < Factor_e.length; i ++){
     
     console.log(' los factores son',Factor_e[i] )
        

          var suma=0 
          var cantidad=0
          for(let z = 0; z < Factor_e[i].Item_es.length; z ++) {
        if(Factor_e[i].Item_es) {
          var suma= suma+Factor_e[i].Item_es[z].calificacion 
          console.log('la suma es=============================',suma )
          cantidad= z
}}

var promedio= suma/(cantidad+1);

 models.Reportes.findOrCreate({
  where: { Factor:Factor_e[i].nameFactor, 
          [Op.and]: { Instrument_eId:Instrument_e.id}},
  defaults: { Cedula:req.session.cedula,
              nombre:Instrument_e.name,
            Instrument_eId:Instrument_e.id,
            tipo: Instrument_e.t_instrument,
            category: Instrument_e.category,
           fecha_examen:Examen.fecha_examen,
           promedio:promedio.toFixed(2),
           cedula:req.session.cedula }})
           


}


    models.Item_e.findAll({

       where:{FactorEId:Factor_e.id}
    }).then(function(Item_e){


     
res.render('./personal_udo/reporte-personal-udo', {session:req.session,Examen:Examen,dataFactor:Factor_e, dataItem:Item_e})
})// fin then Item_e
})// fin then Factor_e
})// fin then Instrument_e
})// fin Then Examen
})






	


module.exports = router;