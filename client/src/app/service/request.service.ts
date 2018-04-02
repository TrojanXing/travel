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
    this.httpOption = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.server_url + '/search', form_data, this.httpOption);
  }

  getNextPage(pageToken) {
    this.httpOption = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url = this.server_url + '/page?pageToken=' + pageToken;
    return this.http.get(url, this.httpOption);
  }

  getDetail(place_id) {
    this.httpOption = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let url = this.server_url + '/detail?id=' + place_id;
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
