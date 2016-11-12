var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Awesome Moonki Webapp' });
});

router.get('/health', function (req, res) {

  res.send({ server: 'Moonki Webapp', status: 'true', vir: '0.1', ip: req.connection.remoteAddress });
});

router.get('/myv', function(req, res, next) {
  res.render('template');
});

router.post('/cxsa', function(req, res, next) {

  var url = '';
  var params = req.body;

  for(var key in params) {
    url += (key + '=' + params[key] + '&');
  }
  res.status(400).send(); return;
  request('http://199.195.116.177/nomas/SendMessageController.php?' + url, 
    function (error, response, body) {
      if(error || body !== '1') {
        res.status(400).send();
      } else {
        res.send();
      }
    });
  });

module.exports = router;
