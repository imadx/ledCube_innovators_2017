const _ = require('lodash');
const uuidV4 = require('uuid/v4');
const bcrypt = require('bcrypt-nodejs');

var express = require('express');
var router = express.Router();

var current_admin_uuid = '';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/competitor', function(req, res, next) {
  res.render('competitor');
});

router.get('/judge', function(req, res, next) {
  res.render('judge');
});

router.get('/scoreboard', function(req, res, next) {
  res.render('scoreboard');
});

router.get('/admin', function(req, res, next) {
	var _key = req.query.hash;
	if(_.isEqual(_key, current_admin_uuid)){
		res.render('admin');
	} else {
		res.render('admin_failed');		
	}
});

router.post('/admin', function(req, res, next) {

	var _key = req.body.key;
	var _hash = '$2a$10$BJhp9t9Ioz5gDzZ4YP/OpOSmV4nSsUPI78HRyKwLSZ14HMmuL46/m';

	if(bcrypt.compareSync(_key, _hash)){
		current_admin_uuid = uuidV4();
		res.send({status: 'OK', key: current_admin_uuid});
	} else {
		res.send({status: 'Authentication Failed!'})
	}

});

module.exports = router;
