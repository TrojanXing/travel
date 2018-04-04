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
const YELP_API = 'https://api.yelp.com/v3/businesses';
const YELP_TOKEN = 'L8oWSZcl-bizksbRENFy2tV8bxlv32Xpd7Z3Qv51cauwyaSO-oh6FdVpltMQcs8KhgDc2P_FycgevrvsWdKAqKT--0rNpllaQT0V_r7wC1ICEZMP580cv8juE9DCWnYx';

const app = express();
const port = 8888;

/**
 * Set up routes
 */
app.use(express.static('./client/dist'));
app.use(cors({
  origin: 'http://localhost:4200' //dev server
}));
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

app.get('/', function(req, res) {
  res.sendFile(path.join('./client' + '/dist/index.html'));
});

/* search places */
app.get('/search', function(req, res, next) {
	let {keyword, category, start_loc, start_here, distance} = req.query;
	// console.log(req.query);
	distance = MILE_TO_METER * distance;
	category = category === 'default'? '': "&type=" + category;

	let geoPromise = start_here === 'true'? Promise.resolve(start_loc): getGeoCode(start_loc);

	return geoPromise
		.then(geocode => {
			let url = MAP_API + "location=" + geocode + "&radius=" + distance + "&keyword=" + keyword + category + "&key=" + GOOGLE_KEY
			// console.log(geocode);
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
      console.log(search_result);
      console.log('Get search result');
      res.status(200).send(search_result);
      return null;
		}).catch(err => {
			//console.log(err);
		});
});

app.get('/page', function(req, res, next) {
	let pageToken = req.query.pageToken;
	let url = MAP_API + 'pagetoken=' + pageToken + '&key=' + GOOGLE_KEY;
	// console.log(url);
  let option = {
    url: url,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  };
  return request(option)
		.then(data => {
			res.status(200).send(data);
		});
});

/* get place detail */
app.get('/detail', function(req, res, next) {
	let place_id = req.query.id;
	let url = DETAIL_API + "placeid=" + place_id + "&key=" + GOOGLE_KEY;
	let option = {
		url: url,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
	};
	return request(option)
		.then(data => {
			res.status(200).send(data);
		})
});

app.get('/yelp', function	(req, res, next) {
	let {name, city, country, state, address} = req.query;
	let url = YELP_API + '/matches/best?' + 'name=' + name.replace(/\s+/gi, '+')
    + '&city=' + city.replace(/\s+/gi, '+')
    + '&state=' + state
    + '&country=' + country
    + '&address1=' + address.replace(/\s+/gi, '+');
	console.log(url);
	let option = {
		url: url,
		headers: {
      'User-Agent': 'Request-Promise',
			'Authorization': `Bearer ${YELP_TOKEN}`
		},
		json: true
	};
	let result = {};
	result.reviews = [];
	return request(option)
		.then(result => {
			let business = result.businesses;
			if(business.length !== 0) {
				console.log(business);
				return business[0].id;
			} else {
				throw('No business found');
			}
		}).then((id) => {
			option.url = YELP_API + "/" + id + '/reviews';
			console.log(option.url);
			return request(option)
		}).then(reviews => {
		  console.log(reviews);
			if(reviews) {
        res.status(200).send(reviews);
			} else {
				res.status(200).send([]);
			}
		}).catch(err => {
			console.log(err);
			res.status(200).send([]);
		})

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
