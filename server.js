const express = require('express');
const request = require('request-promise');
const cors = require('cors');
const body_parser = require('body-parser');
// const path = require('path');

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
app.use(cors({
  origin: 'http://localhost:4200' //dev server
}));
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname + '/public/index.html'));
// });

/* search places */
app.post('/search', function(req, res, next) {
	let {keyword, category, start_loc, start_here, distance, pageToken} = req.body;
	distance = MILE_TO_METER * distance;
	keyword = keyword.replace(' ', '_');
	category = category === 'default'? '': "&type=" + category;
	pageToken = pageToken? "&pagetoken=" + pageToken : '';

	let geoPromise = start_here? start_loc: getGeoCode(start_loc);

	return geoPromise
		.then(geocode => {
			let url = MAP_API + "location=" + geocode + "&radius=" + distance + "&keyword=" + keyword + category + pageToken + "&key=" + GOOGLE_KEY
			console.log(url);
      let option = {
        url: url,
        headers: {
          'User-Agent': 'Request-Promise'
        },
        json: true
      };
			return request(option);
		}).then(search_result => {
			if(search_result.status === 'OK') {
				console.log('Geo search result');
        res.status(200).send(search_result);

			} else {
				res.status(400).send(search_result);
			}
			return null;
		}).catch(err => {
			console.log(err);
		});
})


/**
 * Set up port
 */
app.listen(port, function() {
  console.log('Listening to port ' + port);
});

/* utility */
function getGeoCode(location) {
	location = location.replace(/\s+/, '+');
	let option = {
		url: GEO_CODE_API + 'address=' + location + '&key=' + GOOGLE_KEY,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
	};

	return request(option)
		.then(geo_info => {

			if(geo_info.status === 'OK') {
        console.log("Get geocode for location success");
				let geometry = geo_info.results[0].geometry.location;
				return geometry.lat + "," + geometry.lng;
			} else {
				console.log("Cannot get geocode for given location");
				return '';
			}

		})
}