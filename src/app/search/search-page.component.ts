import { Component, OnInit, ElementRef, Inject, Input  } from '@angular/core';
import { UserService } from '../services/user.service';
import { NavbarSearchComponent } from './navbar-search.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API_ROUTES } from '../app.constants';
import { Angular2TokenService } from 'angular2-token';
import { CONSTANTS, Search } from '../app.constants';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { SearchService } from './search.service';
import { Subject } from 'rxjs/Subject';

declare var $: any;

declare var Snackbar: any;

@Component({
  selector: 'search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  providers: [SearchService]
})

export class SearchPageComponent implements OnInit {
  public loadingResults: boolean = false;
  public errors: any = [];
  public q: string = '';
  public open: boolean = true;

  results: any = [];
  // results: Object;
  searchTerm$ = new Subject<string>();

  query_params = this.searchService.queryObject();

  // Filtros
  categories: any = [];
  public pymes: boolean = true;
  public independents: boolean = true;
  public sellers: boolean = true;
  public low_to_high_price: boolean = true;
  public cities: any = ['Punto Fijo', 'Lima', 'Montevideo'];

  constructor(
    private _tokenService: Angular2TokenService,
    private searchService: SearchService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private route: ActivatedRoute) {
    this._tokenService.init({apiBase: CONSTANTS.BACK_URL});
    this.searchService.search(this.searchTerm$)
      .subscribe(results => {
        this.results = results.results;
      });
  }

  ngOnInit(){
    this.getCategories()
    this.getResults()
  }

  getCategories(){
    let url = API_ROUTES.getCategories();
    this._tokenService.get(url).subscribe(
      data =>      {
        this.categories = JSON.parse(data['_body']);
      },
      error =>  {
        if('_body' in error){
          error = error._body;
          console.log('error: ',error);
          if (error.errors && error.errors.full_messages){
            error.errors.full_messages.forEach(element => {
              this.errors.push(element);
            });
          }
          // this.toastr.error("Error al obtener las Pymes", 'Pyme Error');
        }
      }
    );
  }

  getResults() {
    this.loadingResults = true;
    this.q = '';
    this.categories = '';
    this.route.queryParams.debounceTime(2000).distinctUntilChanged().subscribe(params =>{
      // perform search here and bind result to template only after the input has changed and 500ms have passed
      let url = API_ROUTES.searchs(params.q);
      this._tokenService.get(url).subscribe(
        data => {
          data = JSON.parse(data['_body']);
          if (data['data'].length) {
            this.results = data['data'];
          } else  {
            this.results = []
          }
          this.loadingResults=false;
          console.log(this.results)
        },
        error => {
          this.loadingResults = false;
          if('_body' in error) {
            this.results = []
            error = error._body;
            if (error.errors && error.errors.full_messages) {
              error.errors.full_messages.forEach(element => {
                this.errors.push(element);
              });
            }
            Snackbar.show({
              text: 'Revisa tu conexión a internet',
              showAction: true,
              actionText: '<i class="material-icons">close</i>',
              pos: 'top-right',
              actionTextColor: '#fff'
            });
            }
        })
    })
  }
}
