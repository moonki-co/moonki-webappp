var express = require('express');
var router = express.Router();
var request = require('request');

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
