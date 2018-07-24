import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RequestOptions, Headers } from '@angular/http';
import { API_ROUTES } from '../app.constants';
import { Http } from '@angular/http';

@Injectable()
export class UserService  {
  public user: any = {};
  public errors: any = [];
  public errorHttp: boolean = false;
  public loading: boolean = false
  // private http: any = Http;
  private headers: any;
  constructor(private http: Http, private httpClient: HttpClient) {
    this.user;
    this.headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
  }

  createUser(){
    // this.loading=true;
    this.errors=[];
    let url = API_ROUTES.registerUser();
    let Params = new HttpParams();
    Params = Params.append('email', this.user.email);
    Params = Params.append('name', this.user.name);
    Params = Params.append('nickname', this.user.nickname);
    Params = Params.append('password', this.user.password);
    Params = Params.append('password_confirm', this.user.password_confirmation);
    return this.http.post(url, this.user, { headers: this.headers, params: Params });
  }
  logIn(){
    // this.loading=true;
    this.errors=[];
    let url = API_ROUTES.login(this.user.email, this.user.password);
    return this.http.post(url, this.user, { headers: this.headers })
  }
  forgotPasswordStepOne(user){
    let url = API_ROUTES.forgotPasswordStepOne();
    return this.http.post(url, this.user, { headers: this.headers })
  }
  currentUser(token, client, uid){
    let options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json');
    options.headers.append('access-token', token);
    options.headers.append('client', client);
    options.headers.append('uid', uid);
    this.headers.set('access-token', token);
    let url = API_ROUTES.currentUser();
    return this.http.get(url, options)
  }
  updateUser(token, client, uid){
    console.log(this.user);
    let options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json');
    options.headers.append('access-token', token);
    options.headers.append('client', client);
    options.headers.append('uid', uid);
    this.headers.set('access-token', token);
    let url = API_ROUTES.updateUser();
    return this.http.patch(url, this.user, options)
  }
}
