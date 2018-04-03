import {Component, OnChanges, OnInit, SimpleChanges, Input, ElementRef, Output, EventEmitter} from '@angular/core';
import { } from 'googlemaps';
import {Form, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {split} from "ts-node";
import * as moment from 'moment';
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit, OnChanges {

  @Input() place: Object;
  @Input() display_status = 'hide';
  @Input() favorites;
  @Input() detail;

  @Output() onDetailHidden: EventEmitter<Object> =  new EventEmitter<Object>();
  @Output() onFavoriteChanged: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() onDetailObrained: EventEmitter<Object> = new EventEmitter<Object>();

  public map;
  public street_view;
  public map_service;
  public marker;
  public showMap = true;

  public form;
  public travel_modes = ['DRIVING', 'BICYCLING', 'TRANSIT', 'WALKING'];
  public directionsService;
  public directionsDisplay;
  public reviews;
  public google_reviews;
  public yelp_reviews;
  public review_origin = 'Google Reviews';    //True for google, false for yelp
  public order_method = 'Default Order';
  public photos;
  public photo_col = [[],[],[],[]];
  public utl_arr = [[1],[1,1],[1,1,1],[1,1,1,1],[1,1,1,1,1]];
  public weekday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
  public opening_hours = [];

  constructor(
    private elementRef: ElementRef,
    private formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  /**
   *  Calculate route
   */
  createForm() {
    this.form = this.formBuilder.group({
      start_loc_route: ['Your location'],
      end_route: [],
      travel_mode: ['DRIVING'],
    });
  }

  calcRoute(e) {
    e.preventDefault();
    let origin = this.form.get('start_loc_route').value === 'Your location'? localStorage.getItem('client_loc') : this.elementRef.nativeElement.querySelector('#start_loc_route').value;
    let request = {
      origin: origin,
      destination: this.detail.formatted_address,
      travelMode: this.form.get('travel_mode').value,
      provideRouteAlternatives: true
    };
    //console.log(request);
    this.marker.setMap(null);

    //this.directionsDisplay.setMap(this.map);
    this.directionsService.route(request, (result, status) => {
      if(status === 'OK') {
        // console.log(result);
        this.directionsDisplay.setDirections(result);
      } else {
        console.log('Something wrong, cannot get route')
      }
    });
  }

  toggleMapContent() {
    this.showMap = !this.showMap;
  }

  /**
   * Info section
   */
  calcPriceLevel(price_level) {
    if(!price_level) return '';
    let str = '';
    for(let i = 0; i < price_level; i++) {
      str += '$';
    }
    return str;
  }


  /**
   * Review section
   */
  changeReviewOrigin(origin) {
    if(origin) {
      //Google reviews
      this.reviews = this.google_reviews;
    } else {

    }

  }

  /**
   * Utility
   */
  capitalize(str) {
    return str[0].toUpperCase() + str.substring(1).toLowerCase();
  }

  formatOpenTime(str) {
    let arr = str.split(" ");
    arr.splice(0, 1);
    return arr.join(" ");
  }

  formatDate(time) {
    return moment(time * 1000).format('YYYY-MM-DD HH:mm:ss');
  }

  checkWeekday(str) {
    let today = new Date();
    return str.split(':')[0] === this.weekday[today.getUTCDay()-1];
  }

  checkOpenStatus(opening_hours) {
    if(!opening_hours) return '';
    let now = moment().utc().local();

    let today_period = opening_hours['periods'][now.weekday()%7];
    let today_open = moment().utc().local().set({
      'hour': today_period['open']['time'].substring(0,2),
      'minute': today_period['open']['time'].substring(2,4)
    });
    let today_close = moment().utc().local().set({
      'hour': today_period['close']['time'].substring(0,2),
      'minute': today_period['close']['time'].substring(2,4)
    });

    if(now.isBefore(today_close) && now.isAfter(today_open)){
      return "Open now: " + opening_hours['weekday_text'][now.weekday()-1];
    } else {
      return "Closed";
    }
  }

  /**
   * Tweet section
   */
  composeTweet() {
    let text = `Check+out+${this.detail['name']}+located+at+${this.detail['formatted_address']}. Website: ${this.detail['website'] || this.detail['url']}&via=TravelAndEntertainmentSearch`;
    window.open("https://twitter.com/intent/tweet?text=" + text,"Tweet", "height=400,width=800")
  }

  createArr(n) {
    return this.utl_arr[n-1];
  }

  hideDetail() {
    this.onDetailHidden.emit();
  }

  addOrRemoveFavorite() {
    this.onFavoriteChanged.emit(this.place);
  }

  checkIfInFavorite() {
    if(!this.favorites || !this.place) return false;
    let ind = this.favorites.findIndex((elem) => {
      return elem.id === this.place['id'];
    });
    return ind !== -1;
  }

  /**
   * Photo section
   */
  splitPhotos(photos) {
    this.photo_col = [[],[],[],[]];
   photos.forEach((photo, ind) => {
     this.photo_col[ind % 4].push(photo.getUrl({maxWidth: 1600}));
   });
  }

  /**
   * Initial section
   */
  ngOnInit() {

    let autocomplete = new google.maps.places.Autocomplete(this.elementRef.nativeElement.querySelector('#start_loc_route'), {
      types: ["address"]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['display_status'] && changes['display_status']['currentValue']) this.display_status = changes['display_status']['currentValue'];
    if(changes['favorites']) this.favorites = changes['favorites']['currentValue'];
    if(changes['detail'] && changes['detail']['currentValue']) {
      this.detail = changes['detail']['currentValue'];
      console.log(this.detail);
      this.reviews = this.detail['reviews'];
      this.google_reviews = this.reviews;
      this.photos = this.detail['photos'] || [];
      this.opening_hours = this.detail['opening_hours'] || [];
      this.splitPhotos(this.photos);
    }
    if(changes['place'] && changes['place']['currentValue']) {
      this.place = changes['place']['currentValue'];
      //Initialize map
      this.map = new google.maps.Map(this.elementRef.nativeElement.querySelector('#map'), {
        center: this.place['geometry']['location'],
        zoom: 17
      });

      this.street_view = new google.maps.StreetViewPanorama(this.elementRef.nativeElement.querySelector('#streetView'), {
        position: this.place['geometry']['location'],
        pov: {
          heading: 165,
          pitch: 0
        },
        zoom: 1
      });

      this.marker = new google.maps.Marker({
        map: this.map,
        position: this.place['geometry']['location']
      });

      //Get Detail
      let request = {
        placeId: this.place['place_id']
      };

      this.map_service = new google.maps.places.PlacesService(this.map);
      this.map_service.getDetails(request, (detail, status) => {
        // this.detail = detail;
        // this.reviews = detail['reviews'];
        // this.google_reviews = this.reviews;
        // this.photos = detail['photos'] || [];
        // this.opening_hours = detail['opening_hours'] || [];
        // this.splitPhotos(this.photos);
        this.onDetailObrained.emit(detail);
      });

      this.directionsService = new google.maps.DirectionsService();
      this.directionsDisplay = new google.maps.DirectionsRenderer();
      this.directionsDisplay.setMap(this.map);
      this.directionsDisplay.setPanel(this.elementRef.nativeElement.querySelector('#detail_routes'));
    }
  }
}
