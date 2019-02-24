var express = require('express');
var expressStaticGzip = require("express-static-gzip");
var app = express();

var path = require('path');
var db = require('../database/index.js');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.set('port', 3003);
app.use(express.json());

app.use('/', expressStaticGzip(path.join(__dirname, '../client'), {
  enableBrotli: true,
  customCompressions: [{
      encodingName: 'deflate',
      fileExtension: 'zz'
  }],
  orderPreference: ['br', 'gz']
}));
// app.use(express.static(path.join(__dirname, '../client')));

app.listen(app.get('port'));


app.get('/api/reviews/:listingId', function (req, res) {
  db.returnListing(Number(req.params.listingId), function(err, data) {
    if (err) {
      throw (err);
    } else {
      res.send(data);
    }
  });
});

app.use('/:id', express.static(path.join(__dirname, '../client')));
