import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule} from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';

import { RequestService } from "./service/request.service";
import { TableComponent } from './components/table/table.component';
import { AgmCoreModule } from "@agm/core";
import { DetailComponent } from './components/detail/detail.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    TableComponent,
    DetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBN20SIlF5X2epJryqAvSNXBLpifLKu5fM",
      libraries: ["places"]
    }),
    BrowserAnimationsModule,
  ],
  providers: [
    RequestService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
