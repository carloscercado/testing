import { Component, OnInit, ViewChild, Input } from '@angular/core';

// import { SearchPageComponent } from "./search/search-page.component";
// import { NavbarSearchComponent } from "./search/navbar-search.component";

// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  // @ViewChild('search-page') searchPage:SearchPageComponent;
  // @ViewChild('navbar-search') navbarSearch:NavbarSearchComponent;
  //
  // ngOnInit() {
  //   this.navbarSearch.emitEvent
  //   .subscribe(
  //     res =>
  //     {
  //     console.log("Atributo:" + res);
  //     this.searchPage.dataShared = res;
  //     }
  //   );
  // }
  //
  // change():void {
  //   this.navbarSearch.function1();
  // }

}
