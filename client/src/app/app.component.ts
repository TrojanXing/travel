import {AfterViewInit, Component, ViewChild, OnInit, ViewEncapsulation} from '@angular/core';
import { SearchComponent } from "./components/search/search.component";
import { TableComponent } from "./components/table/table.component";
import { RequestService } from "./service/request.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('detail_display_status', [
      state('show', style({
        position: 'absolute',
        top: 40,
        left: 0,
      })),
      state('hide',   style({
        position: 'absolute',
        top: 40,
        left: '-100%',
        display: 'none'
      })),
      // transition('show => hide', animate('1000ms ease-in')),
      transition('hide => show', animate('500ms ease-in')),
    ]),
    trigger('table_display_status', [
      state('show', style({
        position: 'absolute',
        top: 40,
        left: 0,
      })),
      state('hide',   style({
        position: 'absolute',
        top: 40,
        left: '100%',
        display: 'none'
      })),
      transition('hide => show', animate('500ms ease-in')),
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  constructor(
    private request: RequestService
  ) {}

  @ViewChild(SearchComponent) search;

  favoritePlaces = [];
  currentPage = 0;
  search_results = {};
  display_content;
  focusd_place;
  searching = false;
  hasNext: Boolean;
  detail_display_status = 'hide';
  table_display_status = 'hide';
  search_err = false;
  detail;

  /**
   * nearby search
   */
  nearby_search(form) {
    this.searching = true;
    this.request.searchPlaces(form).subscribe(data => {
      if (data['status'] === 'OK') {
        this.searching = false;
        this.search_results[this.currentPage] = data;
        this.display_content = data['results'];
        this.hasNext = !!data['next_page_token'];
        this.showTable();
        this.search_err = false;
        console.log('nearby search success');
      } else {
        this.search_err = true;
        this.hideAll();
      }

      console.log(data);
    });
  }

  addOrRemoveFavorite(place) {
    let favorites = JSON.parse(localStorage.getItem('favorite')) || { 'favorites': [] };
    //console.log(favorites);
    let ind = favorites['favorites'].findIndex(function (elem) {
      return elem.id === place.id;
    });
    if(ind !== -1) {
      favorites['favorites'].splice(ind, 1);
      console.log("favorite removed");
    } else {
      favorites['favorites'].push(place);
      console.log("favorite added");
    }
    localStorage.setItem('favorite', JSON.stringify(favorites));
    this.favoritePlaces = favorites['favorites'];
  }

  requestDetail(place) {
    this.focusd_place = place? place: this.focusd_place;
    this.showDetail();
  }

  showTable() {
    this.detail_display_status = 'hide';
    this.table_display_status = 'show';
  }

  sendDetail(detail) {
    this.detail = detail;
  }

  showDetail() {
    this.detail_display_status = 'show';
    this.table_display_status = 'hide';
  }

  hideAll() {
    this.detail_display_status = 'hide';
    this.table_display_status = 'hide';
  }

  getPrevious() {
    this.currentPage--;
    this.display_content = this.search_results[this.currentPage]['results'];
    this.hasNext = true;
  }

  getNextPage() {
    let c = this.search_results[this.currentPage];
    this.currentPage++;
    if(this.search_results[this.currentPage]) {
      this.display_content = this.search_results[this.currentPage]['results'];
      this.hasNext = !!this.search_results[this.currentPage]['next_page_token'];
    } else {
      this.request.getNextPage(c['next_page_token']).subscribe((data) => {
        this.search_results[this.currentPage] = data;
        this.display_content = data['results'];
        this.hasNext = !!data['next_page_token'];
      })
    }
  }

  ngOnInit() {
    let favorites = JSON.parse(localStorage.getItem('favorite')) || { 'favorites': [] };
    this.favoritePlaces = favorites['favorites'];
  }

}
