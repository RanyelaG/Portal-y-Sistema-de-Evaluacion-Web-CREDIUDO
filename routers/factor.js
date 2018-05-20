let express = require('express') // instanciamos express
let router = express.Router() // llamamos al manejador de rutas de express
let models = require('../models/modelos')

router.use(function(req, res, next) {
  if(req.session.hasOwnProperty('cedula')){
    next();
  }else {
    res.render('index-web-principal-definitivo', {session: req.session})
  }
})

router.get('/', function(req, res) {
  models.Factor.findAll({

  }).then(function(Factor) {
    models.Instrument.findAll({

    }).then(Instrument => {
      console.log(Factor)
      res.render('factor/index_3',{dataFactor:Factor, dataInstrument:Instrument})  
    })
  })
})

/*================LISTAR TODOS LOS FACTORES=================
router.get('/', function(req, res) {
  models.Factor.findAll({

	}).then(function(Factor) {
    res.render('factor/index_3',{dataFactor:Factor})
  })
})
================FIN LISTAR TODOS LOS FACTORES=================*/


/*=============== ADD FACTOR=======================*/
router.post('/add', function(req, res){
  models.Factor.create({
    nameFactor: req.body.nameFactor,
  }).then(() => {
    console.log('estas en agregar factor ',Factor)
    res.redirect('/coord_eval/factor')  
  })
})
/*===============FIN ADD FACTOR=======================*/

/*================EDIT FACTOR==============================*/
router.post('/edit', (req, res) => {
  models.Factor.update({
    nameFactor: req.body.nameFactor
  },{
    where: {
      id: req.body.id
    }
  })
  .then(()=>{
    res.redirect('/coord_eval/factor')
  })
  .catch((data)=>{
    res.redirect('/factor')
  })
})
/*================FIN EDIT FACTOR==============================*/

/*===============DELETE CATEGORIA=======================*/
router.get('/delete/:id', (req, res) => {
  models.Factor.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(()=>{
    res.redirect('/coord_eval/factor')
  })
})
/*===============FIN DELETE CATEGORIA=======================*/

module.exports = router;