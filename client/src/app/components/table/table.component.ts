import {Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnChanges {

  @Input() display_content: Object;
  @Input() favorites;
  @Input() focused_place;
  @Input() isResult;

  @Output() onDetailRequired: EventEmitter<Object> =  new EventEmitter<Object>();
  @Output() onFavoriteChanged: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() onNextPageRequired: EventEmitter<Object> = new EventEmitter<Object>();

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    //console.log(changes);
    if(changes['display_content']) this.display_content = changes['display_content']['currentValue'];
    if(changes['favorites']) this.favorites = changes['favorites']['currentValue'];
    if(changes['focused_place']) this.focused_place = changes['focused_place']['currentValue'];
  }

  checkIfFocused(place) {
    if(!this.focused_place) return false;
    return place.id === this.focused_place.id;
  }

  checkIfInFavorite(place) {
    if(!this.favorites) return false;
    let ind = this.favorites.findIndex(function (elem) {
      return elem.id === place.id;
    });
    return ind !== -1;
  }

  addOrRemoveFavorite(place) {
    this.onFavoriteChanged.emit(place);
  }

  requireDetail(place) {
    console.log("Detail button clicked: " + (place? place.name: 'null'));
    this.onDetailRequired.emit(place);
  }

}
