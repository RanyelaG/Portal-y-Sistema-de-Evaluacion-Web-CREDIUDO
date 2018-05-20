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

/*================LISTAR TODOS LOS FACTORES=================*/
router.get('/:id_inst', function(req, res) {
  models.Instrument.findOne({
    where: { id: id_inst }
  }).then(Instrument => {
    models.Factor.findAll({
      include: [ models.Instrument ]
    })
    .then(function(Factor) {
      //res.status(201).send(Factor)
      res.render('coor_evaluacion/factor/index',{dataFactor:Factor, dataInstrument:Instrument})
    })  
  })
})
/*================FIN LISTAR TODOS LOS FACTORES=================*/


/*=============== ADD FACTOR=======================*/
router.post('/add', function(req, res){
  models.Factor.create({
    nameFactor: req.body.nameFactor,
  }).then(() => {
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
    res.redirect('/coord_eval/factor/hola')
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