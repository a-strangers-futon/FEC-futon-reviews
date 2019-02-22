var mongoose = require('mongoose');
var reviewsSchema = require('./schema.js');
//use for local
// mongoose.connect('mongodb://localhost/testReviews');
//use for docker
mongoose.connect('mongodb://172.17.0.2:27017/testReviews');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected');
});


var Reviews = mongoose.model('Reviews', reviewsSchema);

var saveListings = (dataArr, callback) => {
  Reviews.insertMany(dataArr, {ordered: false}, callback);
}

var returnListing = (listingId, callback) => {
  Reviews.find({listingId: listingId}, '-_id -reviews._id -__v', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      callback(null, data);
    }
  })
}

module.exports = {
  saveListings,
  returnListing
};
