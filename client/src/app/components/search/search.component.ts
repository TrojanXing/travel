import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RequestService } from "../../service/request.service";
// import { Output } from "@angular/compiler/src/core";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output() onResultObtained: EventEmitter<Object> =  new EventEmitter<Object>();

  form;
  start_loc;
  start_here = true;
  categories = ['accounting', 'airport', 'amusement_park', 'aquarium', 'art_gallery', 'atm', 'bakery', 'bank', 'bar', 'beauty_salon', 'bicycle_store', 'book_store', 'bowling_alley', 'bus_station', 'cafe', 'campground', 'car_dealer', 'car_rental', 'car_repair', 'car_wash', 'casino', 'cemetery', 'church', 'city_hall', 'clothing_store', 'convenience_store', 'courthouse', 'dentist', 'department_store', 'doctor', 'electrician', 'electronics_store', 'embassy', 'fire_station', 'florist', 'funeral_home', 'furniture_store', 'gas_station', 'gym', 'hair_care', 'hardware_store', 'hindu_temple', 'home_goods_store', 'hospital', 'insurance_agency', 'jewelry_store', 'laundry', 'lawyer', 'library', 'liquor_store', 'local_government_office', 'locksmith', 'lodging', 'meal_delivery', 'meal_takeaway', 'mosque', 'movie_rental', 'movie_theater', 'moving_company', 'museum', 'night_club', 'painter', 'park', 'parking', 'pet_store', 'pharmacy', 'physiotherapist', 'plumber', 'police', 'post_office', 'real_estate_agency', 'restaurant', 'roofing_contractor', 'rv_park', 'school', 'shoe_store', 'shopping_mall', 'spa', 'stadium', 'storage', 'store', 'subway_station', 'supermarket', 'synagogue', 'taxi_stand', 'train_station', 'transit_station', 'travel_agency', 'veterinary_care', 'zoo'];
  search_result;

  constructor(
    private requestService: RequestService,
    private formBuilder: FormBuilder
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
      ])],
      distance: [],
      start_here: [],
      start_loc:[],
      category:[]
    });
  }

  onRadioChange(here) {
    this.start_here = here;
    if(here) {
      this.form.controls['start_loc'].disable();
    } else {
      this.form.controls['start_loc'].enable();
    }
  }

  onSearchSubmit(e) {
    e.preventDefault();
    const search_form = {
      keyword: this.form.get('keyword').value,
      distance: this.form.get('distance').value || 10,
      start_here: this.start_here,
      start_loc: this.start_here? this.start_loc: this.form.get('password').value,
      category: this.form.get('category').value,
    };
    console.log(search_form);
    this.requestService.searchPlaces(search_form).subscribe(data => {
      this.search_result = data;
      this.onResultObtained.emit(data);
      //console.log(data);
    });
  }

  ngOnInit() {
    this.requestService.getClientLocation().subscribe(data => {
      this.start_loc = data['lat'] + ',' + data['lon'];
      console.log(this.start_loc);
    })
  }

}
