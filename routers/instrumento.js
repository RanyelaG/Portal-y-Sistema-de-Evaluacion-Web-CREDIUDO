let express = require('express') // instanciamos express
let router = express.Router() // llamamos al manejador de rutas de express
let models = require('../models/modelos')

//MUY UTIL: res.status(201).send(todo)

router.use('/', function(req, res, next){
  if(req.session.hasOwnProperty('cedula')) {
   next();
     }else{
    
  res.render('./sesion_crediudo/index-admin')
               
 }    

});

router.get('/', function(req, res){
  models.Instrument.findAll({})
  .then(function(Instrument){
    res.render('./instrumento/index_3', {dataInstrument:Instrument})
  })
})

/*===================================INSTRUMENTOS=========================================*/
    /*===============ADD INSTRUMENTO=======================*/
    router.get('/add',function(req, res ){
      models.Category.findAll({})
      .then(function(Category) {
        models.T_instrument.findAll({})
        .then(function(T_instrument){
          res.render('instrumento/create',{dataCategory:Category, dataT_instrument:T_instrument})
        })
      })
    })

    router.post('/add', function(req, res){
      models.Instrument.create({
        name: req.body.name,
        category: req.body.category,
        t_instrument: req.body.t_instrument
      })
      .then(() => {
        res.redirect('/coord_eval/instrumento');
      })
    })
    /*===============FIN ADD INSTRUMENTO=======================*/

    /*===============EDITAR INSTRUMENTO========================*/
    router.post('/edit', (req, res) => {
      models.Instrument.update({
        name: req.body.name,
        category: req.body.category,
        t_instrument: req.body.t_instrument
      },{
        where: {
          id: req.body.id
        }
      })
      .then(()=>{
        res.redirect('/coord_eval/instrumento')
      })
      .catch((data)=>{
        res.redirect('/coord_eval/instrumento')
      })
    })
    /*===============FIN EDITAR INSTRUMENTO=====================*/

    /*===============DELETE INSTRUMENTO========================*/
    router.get('/delete/:id', (req, res) => {
        models.Instrument.destroy({
          where: {
            id: req.params.id
          }
        })
        .then(()=>{
          res.redirect('/coord_eval/instrumento')
        })
      })
    /*===============FIN DELETE INSTRUMENTO=====================*/
/*===================================FIN INSTRUMENTOS=========================================*/

/*====================================DETALLES============================================*/
    /*==============LISTAR DETALLES DE EXAMEN ESPECIFICO===========*/
      router.get('/:id', (req,res) => {
        models.Item.findAll({
          include: [models.Factor], 
          where: {
            instrumentId: req.params.id
          }
        }).then(Item => {      
          models.Factor.findAll({
          })
          .then(Factor => {
            models.Instrument.findOne({
              where: {
                id: req.params.id
              }
            }).then(Instrument => {
              res.render('instrumento/detalles_3', { dataItem:Item, dataFactor:Factor, dataInstrument:Instrument })
              //res.status(201).send(Item)
            })
          })
        })
      })
    /*==============FIN DETALLES DE EXAMEN ESPECIFICO========*/

      /*=======CREAR PREGUNTA PARA EXAMEN ESPECIFICO=============*/
      router.post('/:id/add-item', (req,res) => {
           models.Item.create(
          {
            name: req.body.name,
            instrumentId: req.params.id,
            factorId: req.body.factorId
          }).then((Item)=>{
            // console.log('=============',dataDetail)
            res.redirect('/coord_eval/instrumento/'+ req.params.id);
          })
      })
    /*=======FIN CREAR PREGUNTA PARA EXAMEN ESPECIFICO=============*/

     /* ===================EDITAR ITEM ESPECIFICO================== */
      router.post('/:id/edit-item', (req, res) => {
        models.Item.update({
          name: req.body.name
        },{
          where: {
            id: req.body.id
          }
        })
        .then(()=>{
          res.redirect('/coord_eval/instrumento/'+req.params.id)
          //res.status(201).send(Item)
        })
      })
     /* ===============FIN EDITAR ITEM ESPECIFICO============== */

     /* =======================ELIMINAR ITEM(PREGUNTA)===================*/ 
      router.get('/:id_i/item/delete/:id', (req, res) => {
        models.Item.destroy({
          where: {
            id: req.params.id
          }
        })
        .then(()=>{
          res.redirect('/coord_eval/instrumento/'+req.params.id_i)
        })
      })
      /*===================FIN ELIMINAR ITEM(PREGUNTA)=================== */
/*====================================FIN DETALLES============================================*/

/*====================================VISUALIZAR INSTRUMENTOS============================================*/
  router.get('/ver/todos', function(req, res){
    models.Instrument.findAll({

    }).then(Instrument => {
      res.render('instrumento/visualizar', { dataInstrument:Instrument }) 
      //res.status(201).send(Instrument) 
    })   
  })

  router.post('/ver/por_category', function(req, res){
    models.Instrument.findAll({
      where: { category: req.body.category }
    }).then(Instrument => {
      res.render('instrumento/ver_categorys', { dataInstrument:Instrument })
      //res.status(201).send(Instrument)
    })
  })
/*====================================FIN VISUALIZAR INSTRUMENTOS========================================*/

module.exports = router;