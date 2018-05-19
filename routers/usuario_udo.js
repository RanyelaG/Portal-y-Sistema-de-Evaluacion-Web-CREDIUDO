let express = require('express') // instanciamos express
let router = express.Router() // llamamos al manejador de rutas de express
let models = require('../models/modelos') // requerimos al modelos user en la carpeta usuario

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
	res.render("./personal_udo/personaludoprincipal")
})

module.exports = router;