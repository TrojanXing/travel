import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnChanges {

  @Input() display_content: Object;

  //display_result = []

  constructor() {  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes['display_content']['currentValue']);
    this.display_content = changes['display_content']['currentValue']
  }

}
