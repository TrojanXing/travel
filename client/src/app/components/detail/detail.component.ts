import {Component, OnChanges, OnInit, SimpleChanges, Input, ElementRef, Output, EventEmitter} from '@angular/core';
import { } from 'googlemaps';
import {Form, FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit, OnChanges {

  @Input() place: Object;
  @Input() display_status = 'hide';
  @Input() detail;

  @Output() onDetailHidden: EventEmitter<Object> =  new EventEmitter<Object>();
  @Output() onDetailObtained: EventEmitter<Object> =  new EventEmitter<Object>();

  public map;
  public map_service;
  //public detail;

  public form;
  public travel_modes = ['DRIVING', 'BICYCLING', 'TRANSIT', 'WALKING'];
  public directionsService;
  public directionsDisplay;
  public reviews;

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
      start_loc_route: [],
      end_route: [],
      travel_mode: ['DRIVING'],
    });
  }

  calcRoute(e) {
    e.preventDefault();
    let request = {
      origin: this.form.get('start_loc_route').value,
      destination: this.detail.formatted_address,
      travelMode: this.form.get('travel_mode').value,
      provideRouteAlternatives: true
    };
    console.log(request);

    //this.directionsDisplay.setMap(this.map);
    this.directionsService.route(request, (result, status) => {
      if(status === 'OK') {
        console.log(result);
        this.directionsDisplay.setDirections(result);
      }
    });

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

  calcOpenHour(open_hour) {
    return 'TODO: OPEN';
  }

  /**
   * Utility
   */
  capitalize(str) {
    return str[0].toUpperCase() + str.substring(1).toLowerCase();
  }

  hideDetail() {
    this.onDetailHidden.emit();
  }

  /**
   * Initial section
   */
  ngOnInit() {

    let autocomplete = new google.maps.places.Autocomplete(this.elementRef.nativeElement.querySelector('#start_loc_route'), {
      types: ["address"]
    });
  }

  //TODO: Async load detail
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    console.log(this.place);
    if(changes['display_status'] && changes['display_status']['currentValue']) this.display_status = changes['display_status']['currentValue'];

    if(changes['place'] && changes['place']['currentValue']) {
      this.place = changes['place']['currentValue'];
      //Initialize map
      this.map = new google.maps.Map(this.elementRef.nativeElement.querySelector('#map'), {
        center: this.place['geometry']['location'],
        zoom: 17
      });

      let marker = new google.maps.Marker({
        map: this.map,
        position: this.place['geometry']['location']
      });

      //Get Detail
      let request = {
        placeId: this.place['place_id']
      };

      this.map_service = new google.maps.places.PlacesService(this.map);
      this.map_service.getDetails(request, (detail, status) => {
        // console.log(status);
        //this.detail = detail;
        this.onDetailObtained.emit(detail);
        //console.log(this.detail);
        // console.log(this.reviews);
      });

      this.directionsService = new google.maps.DirectionsService();
      this.directionsDisplay = new google.maps.DirectionsRenderer();
      this.directionsDisplay.setMap(this.map);
      this.directionsDisplay.setPanel(this.elementRef.nativeElement.querySelector('#detail_routes'));
    }

    if(changes['detail'] && changes['detail']['currentValue']) {
      this.detail = changes['detail']['currentValue'];
      this.reviews = this.detail['reviews'];

    }
  }
}
