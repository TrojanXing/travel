import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class RequestService {

  httpOption;
  server_url = 'http://localhost:8888';
  ip_api_url = "http://ip-api.com/json/";
  NEARBY_API = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
  GOOGLE_KEY = 'AIzaSyBN20SIlF5X2epJryqAvSNXBLpifLKu5fM';
  DETAIL_API = 'https://maps.googleapis.com/maps/api/place/details/json?';
  PLACE_PHOTO = 'https://maps.googleapis.com/maps/api/place/photo?';

  constructor(
    private http: HttpClient
  ) {}

  // TODO: change post to get
  searchPlaces(form_data) {
    // keyword, category, start_loc, start_here, distance, pageToken
    let url = this.server_url + '/search?'
      + 'keyword=' + form_data.keyword.replace(/\s+/gi, '_')
      + '&category=' + form_data.category
      + '&start_loc=' + form_data.start_loc.replace(/\s+/gi, '+')
      + '&start_here=' + form_data.start_here
      + '&distance=' + form_data.distance;
    console.log(url)
    this.httpOption = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(url, this.httpOption);
  }

  getNextPage(pageToken) {
    this.httpOption = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url = this.server_url + '/page?pageToken=' + pageToken;
    return this.http.get(url, this.httpOption);
  }

  getYelp(data) {
    let url = this.server_url + '/yelp?'
      + 'name=' + data.name.replace(/\s+/gi, '+')
      + '&city=' + data.city.replace(/\s+/gi, '+')
      + '&country=' + data.country
      + '&state=' + data.state
      + '&address=' + data.address.replace(/\s+/gi, '+');
    console.log(url);
    this.httpOption = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(url, this.httpOption);
  }

  getClientLocation() {
    this.httpOption = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': '*'
    });
    return this.http.get(this.ip_api_url, this.httpOption);
  }

}
