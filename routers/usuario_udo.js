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
			   res.render('index-web-principal-definitivo', {session: req.session, dataEvaluacion:Evaluacion,dataEvaluacion1:Evaluacion1})
               console.log('Administravos Evaluacion', Evaluacion)
               console.log(' Centros evaluacion', Evaluacion1)
 			})
		})
}

});

router.get('/',function(req, res){

	models.Evaluacion.findAll({})
	.then(function(Eva){
		console.log(Eva)
	})

// buscamos cargos unidad y mostramos los botones de pertencer a un nucle la evaluacion o unidad
models.Cargo.findOne({where:{cedula_personal:req.session.cedula}})// buscamos el cargo que tiene el personal logueado
  .then(function(Cargo){
  	models.Unidad.findOne({where:{codigo: Cargo.codigo_unidad}})// buscamos a unidad a la que pertnece ese cargo asociado
  	 .then(function(Unidad){ 
  	   models.Evaluacion.findOne({	where: {codigo_unidad: Unidad.codigo_nucleo}})// verificamos que la unidad de a evaluacion sea el nucleo de la unidad del personal
	    .then(function(Evaluacion){
	    	console.log('verificacion de nucleo o unidad', Evaluacion)
	    if(Evaluacion){// primer si es un nucleo if
	  		
	  		if(Cargo.referencia =='coordinador'){ // tengo que llamar es a instrumento
 				
	            
            	  models.Instrument.findOne({  // buscamos el intrumenyo tipo eval_sub para la categoria pers_admin
                 	where: {t_instrument: 'eval_jefe', [Op.and]: {category:'cent_inves'}}
                 })
                 	.then(function(Instrument){
	  			 	if(Instrument){// si encontramos instrumento tipo eval_jef  

	  			 		models.Instrument.findOne({// buscamos el intrumenyo tipo aut_eval para la categoria pers_admin
	  			 			where: {t_instrument: 'aut_eval', [Op.and]: {category:'cent_inves'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
	  			 				where: {codigo_unidad: Unidad.codigo_nucleo, [Op.and]: {tipo:'centros' , [Op.and]: {enfoque:'Subordinado-Jefe'}}}
	  			 			})
	  			 			.then(function(Evaluacion){
                           
                            if(Evaluacion){  
                           	models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, [Op.and]: {tipo:'centros' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", {session:req.session, Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:Evaluacion, Eva_auto:Evaluacion1, sub_jefe:Instrument, auto:Instrument1})
	  			 			})
	  			 		})
	  			 		    }else{
                            
                            models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, [Op.and]: {tipo:'centros' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad,jefe_sub:null, Eva_jefe:null, Eva_sub:null, Eva_auto:Evaluacion1, sub_jefe:Instrument, auto:Instrument1})
	  			 			})
	  			 		})
                            

                            }

	  			 				
	  			 			})
	  			 			
	  			 		})

	  			 	}else{ // si no encontramos instrumento tipo eval_je lo declaramos null y buscamos el intrumenyo tipo aut_eval para la categoria pers_admin 
	  			 		models.Instrument.findOne({
	  			 			where: {t_instrument: 'aut_eval', [Op.and]: {category:'cent_inves'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, [Op.and]: {tipo:'centros' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
	  			 		res.render("./personal_udo/personaludoprincipal", {session:req.session, Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:null, sub_jefe:null, Eva_auto:Evaluacion1, auto:Instrument1})
	  			 			})
	  			 			}) 
	  			 		})
	  			 	}
	  			 })


	  		}else if(Cargo.referencia == 'jefe'){
	  			console.log('la unidad de la evaluacion=============================',Unidad )

	   			 models.Instrument.findOne({  // buscamos el intrumenyo tipo eval_sub para la categoria pers_admin
                 	where: {t_instrument: 'eval_jef', [Op.and]: {category:'pers_admin'}}
                 })
                 	.then(function(Instrument){
	  			 	if(Instrument){// si encontramos instrumento tipo eval_jef  

	  			 		models.Instrument.findOne({// buscamos el intrumenyo tipo aut_eval para la categoria pers_admin
	  			 			where: {t_instrument: 'aut_eval', [Op.and]: {category:'pers_admin'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
	  			 				where: {codigo_unidad: Unidad.codigo_nucleo, [Op.and]: {tipo:'administrativos' , [Op.and]: {enfoque:'Jefe-Subordinado'}}}
	  			 			})
	  			 			.then(function(Evaluacion){
                           
                            if(Evaluacion){  
                           	models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, [Op.and]: {tipo:'administrativos' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 			models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
	  			 				
	  			 			
                             res.render("./personal_udo/personaludoprincipal", {session:req.session,Unidad:Unidad, Nucleo:Nucleo, jefe_sub:Instrument, Eva_jefe:Evaluacion, Eva_sub:null, Eva_auto:Evaluacion1, sub_jefe:null, auto:Instrument1})
	  			 			})
	  			 			})
	  			 		    }else{
                            
                            models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, [Op.and]: {tipo:'administrativos' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", {session:req.session, Nucleo:Nucleo, Unidad:Unidad,  jefe_sub:null, Eva_jefe:null, Eva_sub:null, sub_jefe:null, Eva_auto:Evaluacion1, auto:Instrument1})
	  			 			})
                            })

                            }

	  			 				console.log('la evaluacion es estas aquiiiii', Evaluacion )
	  			 			})
	  			 			
	  			 		})

	  			 	}else{ models.Instrument.findOne({
	  			 			where: {t_instrument: 'aut_eval', [Op.and]: {category:'pers_admin'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, [Op.and]: {tipo:'administrativos' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
	  			 		res.render("./personal_udo/personaludoprincipal", {session:req.session, Unidad:Unidad, Nucleo:Nucleo, jefe_sub:null, Eva_jefe:null, Eva_sub:null, sub_jefe:null, Eva_auto:Evaluacion1, auto:Instrument1})
	  			 			})
	  			 			}) 

	  			 		})
	  			 	}
	  			 })	  		



	  		 }else if(Cargo.referencia == 'subordinado'){
//=====================================================Subordinado==================================
	  		  	    models.Instrument.findOne({  // buscamos el intrumenyo tipo eval_sub para la categoria pers_admin
                 	where: {t_instrument: 'eval_sub', [Op.and]: {category:'pers_admin'}}
                 })
                 	.then(function(Instrument){
	  			 	if(Instrument){// si encontramos instrumento tipo eval_jef  

	  			 		models.Instrument.findOne({// buscamos el intrumenyo tipo aut_eval para la categoria pers_admin
	  			 			where: {t_instrument: 'aut_eval', [Op.and]: {category:'pers_admin'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
	  			 				where: {codigo_unidad: Unidad.codigo_nucleo, [Op.and]: {tipo:'administrativos' , [Op.and]: {enfoque:'Subordinado-Jefe'}}}
	  			 			})
	  			 			.then(function(Evaluacion){
                           
                            if(Evaluacion){  
                           	models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, [Op.and]: {tipo:'administrativos' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:Evaluacion, Eva_auto:Evaluacion1, sub_jefe:Instrument, auto:Instrument1})
	  			 			})
	  			 		})
	  			 		    }else{
                            
                            models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, [Op.and]: {tipo:'administrativos' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:null, Eva_auto:Evaluacion1, sub_jefe:Instrument, auto:Instrument1})
	  			 			})
                            })

                            }

	  			 				console.log('la evaluacion es', Evaluacion )
	  			 			})
	  			 			
	  			 		})

	  			 	}else{ // si no encontramos instrumento tipo eval_je lo declaramos null y buscamos el intrumenyo tipo aut_eval para la categoria pers_admin 
	  			 		models.Instrument.findOne({
	  			 			where: {t_instrument: 'aut_eval', [Op.and]: {category:'pers_admin'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, [Op.and]: {tipo:'administrativos' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
	  			 		res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:null, sub_jefe:null, Eva_auto:Evaluacion1, auto:Instrument1})
	  			 			}) 
	  			 		})
	  			 		})
	  			 	}
	  			 })
                
                
            }else if(Cargo.referencia == 'investigador'){
            	console.log('estas en investigador')
            	  models.Instrument.findOne({  // buscamos el intrumenyo tipo eval_sub para la categoria pers_admin
                 	where: {t_instrument: 'eval_sub', [Op.and]: {category:'cent_inves'}}
                 })
                 	.then(function(Instrument){
	  			 	if(Instrument){// si encontramos instrumento tipo eval_jef  

	  			 		models.Instrument.findOne({// buscamos el intrumenyo tipo aut_eval para la categoria pers_admin
	  			 			where: {t_instrument: 'aut_eval', [Op.and]: {category:'cent_inves'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
	  			 				where: {codigo_unidad: Unidad.codigo_nucleo, [Op.and]: {tipo:'centros' , [Op.and]: {enfoque:'Subordinado-Jefe'}}}
	  			 			})
	  			 			.then(function(Evaluacion){
                           
                            if(Evaluacion){  
                           	models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, [Op.and]: {tipo:'centros' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:Evaluacion, Eva_auto:Evaluacion1, sub_jefe:Instrument, auto:Instrument1})
	  			 			})
	  			 		})
	  			 		    }else{
                            
                            models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, [Op.and]: {tipo:'centros' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:null, Eva_auto:Evaluacion1, sub_jefe:Instrument, auto:Instrument1})
	  			 			})
                            })

                            }

	  			 				console.log('la evaluacion es', Evaluacion )
	  			 			})
	  			 			
	  			 		})

	  			 	}else{ // si no encontramos instrumento tipo eval_je lo declaramos null y buscamos el intrumenyo tipo aut_eval para la categoria pers_admin 
	  			 		models.Instrument.findOne({
	  			 			where: {t_instrument: 'aut_eval', [Op.and]: {category:'cent_inves'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
                            where: {codigo_unidad: Unidad.codigo_nucleo, [Op.and]: {tipo:'centros' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
	  			 		res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:null, sub_jefe:null, Eva_auto:Evaluacion1, auto:Instrument1})
	  			 			})
	  			 			}) 
	  			 		})
	  			 	}
	  			 })
	  			 }

            	
             // termina tu



	  	}else{
//========================================================================================//	  		
//	  		//de no ser una nucleo osea es una unidad empezamos desde aqui				  //
//																					      //
//                                                                                        //
//                                                                                        //
//                                                                                        //
//========================================================================================//

	  models.Evaluacion.findOne({where: {codigo_unidad: Cargo.codigo_unidad}})
	  .then(function(Evaluacion){console.log('el codigo de la unidad a evaluar es',Evaluacion)
	  	console.log('la unidad de la evaluacion=============================',Unidad )
	  	if(Evaluacion){// segundo if si es una unidad
	  		console.log('es una unidad estasssss aqui===============================================')
	  		if(Cargo.referencia =='coordinador'){ // tengo que llamar es a instrumento
 				
	             console.log('estas en coordinador===========================================')
            	  models.Instrument.findOne({  // buscamos el intrumenyo tipo eval_sub para la categoria pers_admin
                 	where: {t_instrument: 'eval_jefe', [Op.and]: {category:'cent_inves'}}
                 })
                 	.then(function(Instrument){
	  			 	if(Instrument){// si encontramos instrumento tipo eval_jef  

	  			 		models.Instrument.findOne({// buscamos el intrumenyo tipo aut_eval para la categoria pers_admin
	  			 			where: {t_instrument: 'aut_eval', [Op.and]: {category:'cent_inves'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
	  			 				where: {codigo_unidad: Cargo.codigo_unidad, [Op.and]: {tipo:'centros' , [Op.and]: {enfoque:'Subordinado-Jefe'}}}
	  			 			})
	  			 			.then(function(Evaluacion){
                           
                            if(Evaluacion){  
                           	models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, [Op.and]: {tipo:'centros' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:Evaluacion, Eva_auto:Evaluacion1, sub_jefe:Instrument, auto:Instrument1})
	  			 			})
	  			 		})
	  			 		    }else{
                            
                            models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, [Op.and]: {tipo:'centros' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:null, Eva_auto:Evaluacion1, sub_jefe:Instrument, auto:Instrument1})
	  			 			})
                            })

                            }

	  			 				
	  			 			})
	  			 			
	  			 		})

	  			 	}else{ // si no encontramos instrumento tipo eval_je lo declaramos null y buscamos el intrumenyo tipo aut_eval para la categoria pers_admin 
	  			 		models.Instrument.findOne({
	  			 			where: {t_instrument: 'aut_eval', [Op.and]: {category:'cent_inves'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, [Op.and]: {tipo:'centros' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
	  			 		res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:null, sub_jefe:null, Eva_auto:Evaluacion1, auto:Instrument1})
	  			 			}) 
	  			 		})
	  			 		})
	  			 	}
	  			 })


	  		}else if(Cargo.referencia == 'jefe'){
console.log('estas en jefe===========================================')
	   			 models.Instrument.findOne({  // buscamos el intrumenyo tipo eval_sub para la categoria pers_admin
                 	where: {t_instrument: 'eval_jef', [Op.and]: {category:'pers_admin'}}
                 })
                 	.then(function(Instrument){
	  			 	if(Instrument){// si encontramos instrumento tipo eval_jef  

	  			 		models.Instrument.findOne({// buscamos el intrumenyo tipo aut_eval para la categoria pers_admin
	  			 			where: {t_instrument: 'aut_eval', [Op.and]: {category:'pers_admin'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
	  			 				where: {codigo_unidad: Cargo.codigo_unidad, [Op.and]: {tipo:'administrativos' , [Op.and]: {enfoque:'Jefe-Subordinado'}}}
	  			 			})
	  			 			.then(function(Evaluacion){
                           
                            if(Evaluacion){  
                           	models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, [Op.and]: {tipo:'administrativos' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:Instrument, Eva_jefe:Evaluacion, Eva_sub:null, Eva_auto:Evaluacion1, sub_jefe:null, auto:Instrument1})
	  			 			})
	  			 		})
	  			 		    }else{
                            
                            models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, [Op.and]: {tipo:'administrativos' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:null, sub_jefe:null, Eva_auto:Evaluacion1, auto:Instrument1})
	  			 			})
                            })

                            }

	  			 				
	  			 			})
	  			 			
	  			 		})

	  			 	}else{ models.Instrument.findOne({
	  			 			where: {t_instrument: 'aut_eval', [Op.and]: {category:'pers_admin'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, [Op.and]: {tipo:'administrativos' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
	  			 		res.render("./personal_udo/personaludoprincipal", {session:req.session, Unidad:Unidad,Nucleo:Nucleo, jefe_sub:null, Eva_jefe:null, Eva_sub:null, sub_jefe:null, Eva_auto:Evaluacion1, auto:Instrument1})
	  			 			})
	  			 			}) 
	  			 		})

	  			 	}
	  			 })	  		



	  		 }else if(Cargo.referencia == 'subordinado'){
//=====================================================Subordinado==================================
console.log('estas en Subordinado===========================================')
	  		  	    models.Instrument.findOne({  // buscamos el intrumenyo tipo eval_sub para la categoria pers_admin
                 	where: {t_instrument: 'eval_sub', [Op.and]: {category:'pers_admin'}}
                 })
                 	.then(function(Instrument){
	  			 	if(Instrument){// si encontramos instrumento tipo eval_jef  

	  			 		models.Instrument.findOne({// buscamos el intrumenyo tipo aut_eval para la categoria pers_admin
	  			 			where: {t_instrument: 'aut_eval', [Op.and]: {category:'pers_admin'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
	  			 				where: {codigo_unidad: Cargo.codigo_unidad, [Op.and]: {tipo:'administrativos' , [Op.and]: {enfoque:'Subordinado-Jefe'}}}
	  			 			})
	  			 			.then(function(Evaluacion){
                           
                            if(Evaluacion){  
                           	models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, [Op.and]: {tipo:'administrativos' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:Evaluacion, Eva_auto:Evaluacion1, sub_jefe:Instrument, auto:Instrument1})
	  			 			})
	  			 		})
	  			 		    }else{
                            
                            models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, [Op.and]: {tipo:'administrativos' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:null, Eva_auto:Evaluacion1, sub_jefe:Instrument, auto:Instrument1})
	  			 			})
	  			 		})
                            

                            }

	  			 				console.log('la evaluacion es', Evaluacion )
	  			 			})
	  			 			
	  			 		})

	  			 	}else{ // si no encontramos instrumento tipo eval_je lo declaramos null y buscamos el intrumenyo tipo aut_eval para la categoria pers_admin 
	  			 		models.Instrument.findOne({
	  			 			where: {t_instrument: 'aut_eval', [Op.and]: {category:'pers_admin'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, [Op.and]: {tipo:'administrativos' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
	  			 		res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad,jefe_sub:null, Eva_jefe:null, Eva_sub:null, sub_jefe:null, Eva_auto:Evaluacion1, auto:Instrument1})
	  			 			}) 
	  			 		})
	  			 		})	
	  			 	}
	  			 })
                
                
            }else if(Cargo.referencia == 'investigador'){
            console.log('estas en investigador===========================================')
            	  models.Instrument.findOne({  // buscamos el intrumenyo tipo eval_sub para la categoria pers_admin
                 	where: {t_instrument: 'eval_sub', [Op.and]: {category:'cent_inves'}}
                 })
                 	.then(function(Instrument){
	  			 	if(Instrument){// si encontramos instrumento tipo eval_jef  

	  			 		models.Instrument.findOne({// buscamos el intrumenyo tipo aut_eval para la categoria pers_admin
	  			 			where: {t_instrument: 'aut_eval', [Op.and]: {category:'cent_inves'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
	  			 				where: {codigo_unidad: Cargo.codigo_unidad, [Op.and]: {tipo:'centros' , [Op.and]: {enfoque:'Subordinado-Jefe'}}}
	  			 			})
	  			 			.then(function(Evaluacion){
                           
                            if(Evaluacion){  
                           	models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, [Op.and]: {tipo:'centros' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:Evaluacion, Eva_auto:Evaluacion1, sub_jefe:Instrument, auto:Instrument1})
	  			 			})
	  			 		})
	  			 		    }else{
                            
                            models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, [Op.and]: {tipo:'centros' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
                             res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:null, Eva_auto:Evaluacion1, sub_jefe:Instrument, auto:Instrument1})
	  			 			})
                            })

                            }

	  			 				console.log('la evaluacion es aqui====================', Evaluacion )
	  			 			})
	  			 			
	  			 		})

	  			 	}else{ // si no encontramos instrumento tipo eval_je lo declaramos null y buscamos el intrumenyo tipo aut_eval para la categoria pers_admin 
	  			 		models.Instrument.findOne({
	  			 			where: {t_instrument: 'aut_eval', [Op.and]: {category:'cent_inves'}}
	  			 		}).then(function(Instrument1){
	  			 			models.Evaluacion.findOne({
                            where: {codigo_unidad: Cargo.codigo_unidad, [Op.and]: {tipo:'centros' , [Op.and]: {enfoque:'Auto-Evaluacion'}}}
	  			 			})
	  			 			.then(function(Evaluacion1){
	  			 				models.Nucleo.findOne({where:{codigo:Unidad.codigo_nucleo }})
	  			 			.then(function(Nucleo){
	  			 		res.render("./personal_udo/personaludoprincipal", {session:req.session,Nucleo:Nucleo, Unidad:Unidad, jefe_sub:null, Eva_jefe:null, Eva_sub:null, sub_jefe:null, Eva_auto:Evaluacion1, auto:Instrument1})
	  			 			}) 
	  			 		})
	  			 		})
	  			 	}
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




	


module.exports = router;