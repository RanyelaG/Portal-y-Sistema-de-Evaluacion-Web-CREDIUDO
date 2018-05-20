router.get('/demo', function(req, res){ res.render('/demo',  {session: req.session}) })


module.exports = router;