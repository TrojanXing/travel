const express = require('express');
const request = require('request');
const path = require('path');

const MILE_TO_METER = 1609.34;
const MAP_API = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
const DETAIL_API = 'https://maps.googleapis.com/maps/api/place/details/json?';
const PLACE_PHOTO = 'https://maps.googleapis.com/maps/api/place/photo?';
const GOOGLE_KEY = 'AIzaSyBN20SIlF5X2epJryqAvSNXBLpifLKu5fM';
const GEO_CODE_API = 'https://maps.googleapis.com/maps/api/geocode/json?';

const app = express();
const port = 3000;

/**
 * Set up routes
 */
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/detail', function	(req, res, next) {
	let place_id = req.query.place_id;
	let url = DETAIL_API + "placeid=" + place_id + "&key=" + GOOGLE_KEY;
	request.get(url, function(err, response, body) {
		res.status(200).send(response);
	})
})

app.post('/search', function(req, res, next) {

})


/**
 * Set up port
 */
app.listen(port, function() {
  console.log('Listening to port ' + port);
});