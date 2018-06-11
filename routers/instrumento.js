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

//PRIMERA RUTA UNA VEZ LOGUEADO
router.get('/', function(req,res){
  models.Instrument.findAll({
  })
  .then(function(Instrument){
    res.render('coor_evaluacion/instrumento/index', {dataInstrument:Instrument})
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

/*=========ADD FACTOR A INSTRUMENTO==============*/
  //ESTE CONTROLADOR MUESTRA TODOS LOS FACTORES EXISTENTES
  router.get('/:id/add-factor', (req,res) => {
    models.Instrument.findOne({
      where: { id: req.params.id }
    }).then(Instrument => {
      models.Factor.findAll({
        where: { instrumentId: req.params.id },
        include: [ models.Instrument ],
        attribute: ['id', 'nameFactor', 'instrumentId']
      }).then(Factor => {
        //res.status(201).send(Factor)
        res.render('coor_evaluacion/factor/index', {dataFactor:Factor, dataInstrument:Instrument})
      })  
    })
  });

  //ESTE CONTROLADOR AGREGA NUEVOS FACTORES
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
                res.render('coor_evaluacion/instrumento/detalles', { dataItem:Item, dataFactor:Factor, dataInstrument:Instrument })
              })    
            })
          })
        })

      //AGREGAR ITEM A UN FACTOR ESPECIFICO DE UN INSTRUMENTO ESPECIFICO
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

    

     /* ===================EDITAR ITEM ESPECIFICO================== */
      router.post('/:id_inst/add-factor/:id/edit-item', (req, res) => {
        models.Item.update({
          name: req.body.name,
          factorId: req.params.id,
          instrumentId: req.params.id_inst
        },{
          where: {
            id: req.body.id
          }
        })
        .then(()=>{
          res.redirect('/coord_eval/instrumento/'+ req.params.id_inst +'/add-factor/'+ req.params.id)
          //res.redirect('/coord_eval/instrumento/'+req.params.id)
          //res.status(201).send(Item)
        })
      })
     /* ===============FIN EDITAR ITEM ESPECIFICO============== */

     /* =======================ELIMINAR ITEM(PREGUNTA)===================*/ 
      router.get('/:id_inst/factor/:id_fact/item-delete/:id', (req, res) => {
        models.Item.destroy({
          where: {
            id: req.params.id
          }
        })
        .then(()=>{
          res.redirect('/coord_eval/instrumento/'+req.params.id_inst+'/add-factor/'+req.params.id_fact)
        })
      })
      /*===================FIN ELIMINAR ITEM(PREGUNTA)=================== */

    /*==========DELETE FACTOR DE UN INSTRUMENTO===================*/
    router.get('/:id_inst/factor-delete/:id', (req, res) => {
      models.Factor.destroy({
        where: {
          id: req.params.id
        }
      })
      .then(()=>{
        res.redirect('/coord_eval/instrumento/'+req.params.id_inst+'/add-factor')
      })
    })
    /*==========FIN DELETE FACTOR DE UN INSTRUMENTO===================*/

    /*==========EDITAR FACTOR=============================*/
    router.post('/:id/factor-edit', (req, res) => {
      models.Factor.update({
        nameFactor: req.body.nameFactor
      },{
        where: {
          id: req.body.id
        }
      })
      .then(()=>{
        res.redirect('/coord_eval/instrumento/'+req.params.id+'/add-factor')
      })
      .catch((data)=>{
        res.redirect('/coord_eval/instrumento')
      })
    })
    /*==========FIN EDITAR FACTOR=============================*/

    /*============================VISUALIZAR INSTRUMENTO================*/
      router.get('/ver', (req,res) => {
        models.Instrument.findAll({

        }).then(Instrument => {
          res.render('coor_evaluacion/instrumento/ver_todos', { Instruments:Instrument })  
        })
      })

      router.post('/por_category', (req,res) => {
        if ( req.body.buscar == 'todos' ) {
          models.Instrument.findAll({

          }).then(Instrument => {
            res.redirect('/coord_eval/instrumento/ver')
            //res.render('coor_evaluacion/instrumento/ver_todos', { Instruments:Instrument })  
          })
        } else if( req.body.buscar == 'pers_admin' ){
          models.Instrument.findAll({
            where: { category: req.body.buscar }
          }).then(Instrument => {
            res.render('coor_evaluacion/instrumento/ver_admin', { Instruments:Instrument })
          })
        } else if( req.body.buscar == 'cent_inves' ){
          models.Instrument.findAll({
            where: { category: req.body.buscar }
          }).then(Instrument => {
            res.render('coor_evaluacion/instrumento/ver_centros', { Instruments:Instrument })
          })
        }
      })
    /*============================VISUALIZAR INSTRUMENTO================*/

    /*======================VER FORMATO=================================*/
      router.get('/:id/ver_formato', (req,res) => {
        models.Factor.findAll({
          where: {
            instrumentId: req.params.id
          }
        }).then(Factor => {
          models.Item.findAll({
            where: {
              instrumentId: req.params.id
            }
          }).then(Item => {
            //res.send(Item);
            res.render('coor_evaluacion/instrumento/ver_formato', { dataFactor:Factor, dataItem:Item });
          })
        })
      })
    /*======================FIN VER FORMATO=================================*/

/*====================================FIN DETALLES============================================*/

module.exports = router;