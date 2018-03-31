import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { SearchComponent } from "./components/search/search.component";
import { TableComponent } from "./components/table/table.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild(SearchComponent) search;

  title = 'app';
  currentPage = 0;
  search_results = {};
  public display_content: Object;


  display_result(data) {
    this.search_results[this.currentPage] = data.results;
    this.display_content = data.results;
    console.log(data);
  }

}
