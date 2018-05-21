var express = require('express');
var router = express.Router();
var models = require('../models/modelos')
var Sequelize = require('sequelize');
var Op = Sequelize.Op;


router.get('/', function(req, res){ res.render('demo1');})


module.exports = router;