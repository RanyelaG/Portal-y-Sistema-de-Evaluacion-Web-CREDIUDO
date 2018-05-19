var express = require('express')
var router = express.Router()

router.get('/cerrar',(req, res)=>{
  req.session.destroy(()=>{
    console.log('cerrando sesion');
  });
  res.redirect('/');
})

module.exports = router;
