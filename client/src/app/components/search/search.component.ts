import { Component, EventEmitter, OnInit, Output, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RequestService } from "../../service/request.service";
import { } from 'googlemaps';
// import { MapsAPILoader } from "@agm/core";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output() onResultObtained: EventEmitter<Object> =  new EventEmitter<Object>();
  @Output() onFormSubmitted: EventEmitter<Object> =  new EventEmitter<Object>();

  form;
  lat;
  lng;
  start_loc;
  start_here = true;
  categories = ['accounting', 'airport', 'amusement_park', 'aquarium', 'art_gallery', 'atm', 'bakery', 'bank', 'bar', 'beauty_salon', 'bicycle_store', 'book_store', 'bowling_alley', 'bus_station', 'cafe', 'campground', 'car_dealer', 'car_rental', 'car_repair', 'car_wash', 'casino', 'cemetery', 'church', 'city_hall', 'clothing_store', 'convenience_store', 'courthouse', 'dentist', 'department_store', 'doctor', 'electrician', 'electronics_store', 'embassy', 'fire_station', 'florist', 'funeral_home', 'furniture_store', 'gas_station', 'gym', 'hair_care', 'hardware_store', 'hindu_temple', 'home_goods_store', 'hospital', 'insurance_agency', 'jewelry_store', 'laundry', 'lawyer', 'library', 'liquor_store', 'local_government_office', 'locksmith', 'lodging', 'meal_delivery', 'meal_takeaway', 'mosque', 'movie_rental', 'movie_theater', 'moving_company', 'museum', 'night_club', 'painter', 'park', 'parking', 'pet_store', 'pharmacy', 'physiotherapist', 'plumber', 'police', 'post_office', 'real_estate_agency', 'restaurant', 'roofing_contractor', 'rv_park', 'school', 'shoe_store', 'shopping_mall', 'spa', 'stadium', 'storage', 'store', 'subway_station', 'supermarket', 'synagogue', 'taxi_stand', 'train_station', 'transit_station', 'travel_agency', 'veterinary_care', 'zoo'];
  search_result;
  searching = false;

  constructor(
    private requestService: RequestService,
    private formBuilder: FormBuilder,
    // private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private elementRef: ElementRef,
  ) {
    this.createForm();
  }

  capitalizeStr(str) {
    return str
      .toLowerCase()
      .split('_')
      .map(function (word) {
        return word[0].toUpperCase() + word.substring(1);
      })
      .join(' ');
  }

  createForm() {
    this.form = this.formBuilder.group({
      keyword: ['', Validators.compose([
        Validators.required,
        this.keywordValidator
      ])],
      distance: [],
      start_here: [],
      start_loc:[],
      category:['default']
    });
  }

  keywordValidator(controls) {
    if (controls.value && controls.value.trim().length != 0) {
      return null;
    } else {
      return { 'keywordValidator': true };
    }
  }

  startValidator(controls) {
    if (controls.value && controls.value.trim().length != 0) {
      return null;
    } else {
      return { 'startValidator': true };
    }
  }

  onRadioChange(here) {
    this.start_here = here;
    if(here) {
      this.form.controls['start_loc'].disable();
      this.form.controls['start_loc'].clearValidators();
    } else {
      this.form.controls['start_loc'].enable();
      this.form.controls['start_loc'].setValidators([
        Validators.required,
        this.startValidator
      ]);

    }
  }

  onSearchSubmit(e) {
    e.preventDefault();
    this.searching = true;
    const search_form = {
      keyword: this.form.get('keyword').value,
      distance: this.form.get('distance').value || 10,
      start_here: this.start_here,
      start_loc: this.start_here? this.start_loc: this.elementRef.nativeElement.querySelector('#start_loc').value,
      category: this.form.get('category').value,
    };
    this.onFormSubmitted.emit(search_form);
  }

  ngOnInit() {
    this.requestService.getClientLocation().subscribe(data => {
      this.start_loc = data['lat'] + ',' + data['lon'];
      console.log("Get client location " + this.start_loc);
      this.lat = data['lat'];
      this.lng = data['lng'];
      localStorage.setItem('client_loc', this.start_loc);
      //load Place Autocomplete
      let autocomplete = new google.maps.places.Autocomplete(this.elementRef.nativeElement.querySelector('#start_loc'), {
        types: ["address"]
      });

    })
  }

}
