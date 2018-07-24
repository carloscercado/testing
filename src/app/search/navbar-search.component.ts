import { Component, OnInit, ViewChild, ElementRef, Inject, HostListener, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Angular2TokenService } from 'angular2-token';
import { API_ROUTES, CONSTANTS, Search } from '../app.constants';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { SearchService } from './search.service';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

declare var Snackbar: any;

export interface StateGroup {
  letter: string;
  names: string[];
}

@Component({
  selector: 'navbar-search',
  templateUrl: './navbar-search.component.html',
  styleUrls: ['./navbar-search.component.scss'],
  providers: [SearchService]
})

export class NavbarSearchComponent implements OnInit {
  public loading: boolean = false;
  public errors: any = [];
  public categories: any = [];
  public searchControl: FormControl;

  results: Object;
  searchTerm$ = new Subject<string>();

  public q = '';

  stateForm: FormGroup = this.fb.group({
    stateGroup: '',
  });

  stateGroups: StateGroup[] = [{
    letter: 'A',
    names: ['Alabama', 'Alaska', 'Arizona', 'Arkansas']
  }, {
    letter: 'C',
    names: ['California', 'Colorado', 'Connecticut']
  }, {
    letter: 'D',
    names: ['Delaware']
  }, {
    letter: 'F',
    names: ['Florida']
  }, {
    letter: 'G',
    names: ['Georgia']
  }, {
    letter: 'H',
    names: ['Hawaii']
  }, {
    letter: 'I',
    names: ['Idaho', 'Illinois', 'Indiana', 'Iowa']
  }, {
    letter: 'K',
    names: ['Kansas', 'Kentucky']
  }, {
    letter: 'L',
    names: ['Louisiana']
  }, {
    letter: 'M',
    names: ['Maine', 'Maryland', 'Massachusetts', 'Michigan',
      'Minnesota', 'Mississippi', 'Missouri', 'Montana']
  }, {
    letter: 'N',
    names: ['Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
      'New Mexico', 'New York', 'North Carolina', 'North Dakota']
  }, {
    letter: 'O',
    names: ['Ohio', 'Oklahoma', 'Oregon']
  }, {
    letter: 'P',
    names: ['Pennsylvania']
  }, {
    letter: 'R',
    names: ['Rhode Island']
  }, {
    letter: 'S',
    names: ['South Carolina', 'South Dakota']
  }, {
    letter: 'T',
    names: ['Tennessee', 'Texas']
  }, {
    letter: 'U',
    names: ['Utah']
  }, {
    letter: 'V',
    names: ['Vermont', 'Virginia']
  }, {
    letter: 'W',
    names: ['Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
  }];

  stateGroupOptions: Observable<StateGroup[]>;

  constructor(
    private router: Router,
    private _tokenService: Angular2TokenService,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private fb: FormBuilder) {
    this._tokenService.init({apiBase: CONSTANTS.BACK_URL});
    this.router.routeReuseStrategy.shouldReuseRoute = function() {return false;};
    this.searchControl = new FormControl()
  }

  ngOnInit() {
    // console.log(this.route.queryParams)
    this.stateGroupOptions = this.stateForm.get('stateGroup')!.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterGroup(val))
      );
  }

  filterGroup(val: string): StateGroup[] {
    if (val) {
      return this.stateGroups
        .map(group => ({ letter: group.letter, names: this._filter(group.names, val) }))
        .filter(group => group.names.length > 0);
    }

    return this.stateGroups;
  }

  private _filter(opt: string[], val: string) {
    const filterValue = val.toLowerCase();
    return opt.filter(item => item.toLowerCase().startsWith(filterValue));
  }

  goToSearch(search:string){
    this.router.navigateByUrl(`/searchs?q=${search}`)
  }

  submit(terms: Observable<string>) {
    console.log(terms)
    let q = this.q;
    this.router.navigate([`/searchs`], { queryParams: { q } })
  }
}
