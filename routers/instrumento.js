let express = require('express') // instanciamos express
let router = express.Router() // llamamos al manejador de rutas de express
let models = require('../models/modelos')

//MUY UTIL: res.status(201).send(todo)
router.use(function(req, res, next) {
  if(req.session.hasOwnProperty('cedula')){
    next();
  }else {
    console.log('no estas logueado')
    res.render('./sesion_crediudo/index-admin', {session: req.session})
  }
})

router.get('/', function(req,res){
  models.Instrument.findAll({
  })
  .then(function(Instrument){
    res.render('instrumento/index_3', {dataInstrument:Instrument})
  });
});

/*===================================INSTRUMENTOS=========================================*/
    /*===============ADD INSTRUMENTO=======================*/
    

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
      router.get('/:id_inst/add-factor/:id', (req,res) => {
        models.Item.findAll({
          where: { factorId: req.params.id }
        }).then(Item => {
            models.Factor.findOne({
              where: { id: req.params.id }
            }).then(Factor => {
              models.Instrument.findOne({
                where: { id: req.params.id_inst }
              }).then(Instrument => {
                //res.status(201).send(Instrument)  
                res.render('instrumento/detalles_3', { dataItem:Item, dataFactor:Factor, dataInstrument:Instrument })
              })    
            })
          })
        })

      router.post('/:id_inst/add-factor/:id/add-item', (req,res) => {
        models.Item.create({
          name: req.body.name,
          factorId: req.params.id,
          instrumentId: req.params.id_inst
        }).then(() => {
          res.redirect('/coord_eval/instrumento/'+ req.params.id_inst +'/add-factor/'+ req.params.id)
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

    /*=========ADD FACTOR A INSTRUMENTO==============*/
      router.get('/:id/add-factor', (req,res) => {
        models.Instrument.findOne({
          where: { id: req.params.id }
        }).then(Instrument => {
          models.Factor.findAll({
            where: { instrumentId: req.params.id }
          }).then(Factor => {
            //res.status(201).send(Factor)
            res.render('factor/index_3', {dataFactor:Factor, dataInstrument:Instrument})
          })
            
        })
      });

      router.post('/:id/add-factor', (req,res) => {
        models.Factor.create({
          nameFactor: req.body.nameFactor,
          instrumentId: req.params.id
        }).then(Factor => {
          res.redirect('/coord_eval/instrumento/'+req.params.id+'/add-factor')
          //console.log(req.params.id)
        })
      })
    /*=========FIN ADD FACTOR A INSTRUMENTO==============*/

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

module.exports = router;