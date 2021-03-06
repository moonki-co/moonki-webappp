var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Request = require('../model/request');
var Q = require('q');
var fs = require('fs');
var time = require('time');
var logPath = 'data2.json';

/* GET home page. */
router.get('/list', function(req, res) {
    var promise = getList2();

    promise.then(
        function(collection){
            res.json(collection);
        },
        function(){
          res.json({'message': 'Error'});
        }
    );
});

router.get('/minelist', function(req, res) {
    var data = getLog();
    res.json(data);
});

router.get('/save', function(req, res) {
    console.log(req);
    req.query['time'] = getDate();
    var promise = save2(req.query);

    promise.then(
        function(shortUrl){
          res.json(shortUrl);
        },
        function(){
            res.writeHead('Content-Type','text/html; charset=utf-8')
            res.end('adas');
        }
    );
});

router.post('/save', function(req, res) {
    var params = req.body;
    console.log(params);

    params['time'] = getDate();
    var promise = save2(params);

    promise.then(
        function(shortUrl){
          res.json(shortUrl);
        },
        function(){
            res.writeHead('Content-Type','text/html; charset=utf-8')
            res.end('adas');
        }
    );
});

router.get('/mine', function(req, res) {
    req.query['time'] = getDate();
    var promise = save4(req.query);

    promise.then(
        function(){
          res.json(true);
        },
        function(){
            res.status(400).send(false);
        }
    );
});


function getDate() {
  var now = new time.Date();
  now.setTimezone("America/Mexico_City");

  return now.toString();
}

function getList(){

  var deferred = Q.defer();
  var query = Request.find({});

  query.exec(function (err, collection){
    if(err) {
      deferred.reject();
    }
    else {
      deferred.resolve(collection);
    }
  });

    return deferred.promise;
}

function getList2() {
  var deferred = Q.defer();
  var data = getList3();

  if(data) {
    deferred.resolve(data);
  }
  else {
    deferred.reject();
  }
  return deferred.promise;
}

function getList3() {
  return require('../files/data.json');
}

function getLog() {
  delete require.cache[require.resolve('../files/' + logPath)];
  return require('../files/' + logPath);
}

function save(object){

    var deferred = Q.defer();
    var news = new Request({data: JSON.stringify(object)});

    news.save(function (err)
    {
        if (err){
            deferred.reject();
        }
        else{
            deferred.resolve(news);
        }
    });

    return deferred.promise;
}

function save2(object) {
  var deferred = Q.defer();
  var filePath = './files/data.json';
  var data = getList3();

  while(data.length >= 15) {
    data.shift();
  }

  data.push(object);
  data = JSON.stringify(data);

  fs.writeFile(filePath, data, function(error) {
    if(error) {
      //console.log('Error writing: ' + filePath);
      console.log(error);
      deferred.reject();
    }
    else {
      deferred.resolve(object);
    }
  });

  return deferred.promise;
}

function save4(object) {
  var deferred = Q.defer();
  var filePath = './files/' + logPath;
  var data = getLog();

  if(object.opt) {
    data.whos_is_in.push(object);
  } else {
    data.sms.push(object);
  }

  data = JSON.stringify(data);

  fs.writeFile(filePath, data, function(error) {
    if(error) {
      deferred.reject();
    }
    else {
      deferred.resolve(object);
    }
  });

  return deferred.promise;
}

module.exports = router;
