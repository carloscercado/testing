import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { API_ROUTES, CONSTANTS, Search } from '../app.constants';
import { Router } from '@angular/router';
import { Angular2TokenService } from 'angular2-token';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SearchService {
  baseUrl: string = CONSTANTS.BACK_URL;
  queryUrl: string = '/searchs?q=';

  constructor(
    private router: Router,
    private _tokenService: Angular2TokenService,
    private http: Http) { }

  search(terms: Observable<string>) {
    return terms.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(q => this.searchEntries(q));
  }

  searchEntries(q) {
    return this.http
        .get(this.baseUrl + this.queryUrl + q)
        .map(res => res.json());
  }

  queryObject() {
    var query_params = {};
    var query = window.location.hash.substring(1);
    if (query !== '') {
      var query_string = query.split('?')[1];
      var query_vars = query_string.split('&');
      for (var i=0;i<query_vars.length;i++) {
        var pair = query_vars[i].split('=');
        if (typeof query_params[pair[0]] === 'undefined') {
          query_params[pair[0]] = decodeURIComponent(pair[1]);
        } else if (typeof query_params[pair[0]] === 'string') {
          var arr = [ query_params[pair[0]],decodeURIComponent(pair[1]) ];
          query_params[pair[0]] = arr;
        } else {
          query_params[pair[0]].push(decodeURIComponent(pair[1]));
        }
      }
    }
    return query_params;
  }
}
