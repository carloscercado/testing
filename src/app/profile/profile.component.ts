import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API_ROUTES } from '../app.constants';
import { Angular2TokenService } from 'angular2-token';
import { CONSTANTS } from '../app.constants';
import { ActivatedRoute } from '@angular/router';
import { CreatePymeComponent } from '../pymes/create.component';
import { PymesComponent } from '../pymes/pymes.component';
import { SellersComponent } from '../sellers/sellers.component';
import { CreateIndependentsComponent } from '../independents/create.component';
import { CreateSellerComponent } from '../sellers/create.component';
import { IndependentsComponent } from '../independents/independents.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

declare var Snackbar: any;

@Component({
  providers:[PymesComponent],
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  public option: string = 'dashboard';
  public urlImage: string = '';
  public loading: boolean = false;
  public open: boolean = true;
  public fileToUpload: File = null;
  public toggleImage: boolean = false;
  public imageCache: any = '';
  public user: any = {
    id: '',
    nickname: '',
    email: '',
    name: '',
    current_password: '',
    token: '',
    client: '',
    uid: '',
    avatar: ''
  };

  public errors: any=[];
  public errorsRegister: any;
  public errorHttp: boolean = false;
  @ViewChild('modalCreateClose') modalCreateClose: ElementRef;
  constructor(
    private compPyme: PymesComponent,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) private data: any,
    private activatedRoute: ActivatedRoute, private userService: UserService, private router: Router,
    private toastr: ToastrService, private _tokenService: Angular2TokenService) {
      this._tokenService.init({apiBase: CONSTANTS.BACK_URL});
      this.activatedRoute.queryParams.subscribe(params => {
        if ('tab' in params) {
          this.option=params['tab'];
        } else
          this.option='dashboard';
      });
   }

   onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        let target: any = event.target;
        let content: string = target.result;
        this.toggleImage = true;
        this.imageCache = content;
        this.user.avatar = content;
        this.updateUser();
        this.toggleImage = false;
        this.imageCache = null;
      }
    }
  }

  ngOnInit(){
    var object = this;
    this.loading=true;
    this.user = JSON.parse(window.localStorage.getItem('user'));
    let url = API_ROUTES.currentUser();
    this._tokenService.get(url).subscribe(
      data =>      {
        data = JSON.parse(data['_body']);
        // if (!data){
        //   this.router.navigate(['/']);
        // }
        let id = data['data'].id;
        this.user = Object.assign({}, this.user, data['data'].attributes);
        this.user.id = id;
        window.localStorage.setItem('user', JSON.stringify(this.user));
        this.loading=false;
      },
      error =>   {
        this.errorHttp = true; this.loading=false;
        if("_body" in error){
          error = error._body;
          console.log("error: ",error);
          if (error.errors && error.errors.full_messages){
            error.errors.full_messages.forEach(element => {
              Snackbar.show({
                text: `${element}`,
                showAction: true,
                actionText: '<i class="material-icons">close</i>',
                ppos: "top-right",
                actionTextColor: '#fff'
              });
            });
          }
        }
        this.router.navigate(['/']);
      }
    );
  }

  updateUser(){
    var object = this;
    object.errors=[];
    this.loading=true;
    this.userService.user = this.user;
    let url = API_ROUTES.updateUser();
    this._tokenService.put(url, this.user).subscribe(
      data =>      {
        data = JSON.parse(data['_body']);
        console.log("data:: ", data);
        this.user = Object.assign({}, this.user, data['data']);
        Snackbar.show({
          text: "Perfil Actualizado Exitosamente",
          showAction: true,
          actionText: '<i class="material-icons">close</i>',
          pos: "top-right",
          actionTextColor: '#fff'
        });
        this.loading=false;
      },
      error => {
        this.errorHttp = true; this.loading=false;
        if("_body" in error){
          error=JSON.parse(error._body);
          console.log(error);
          console.log(object);
          if (error.errors.full_messages){
            error.errors.full_messages.forEach(element => {
              Snackbar.show({
                text: `${element}`,
                showAction: true,
                actionText: '<i class="material-icons">close</i>',
                ppos: "top-right",
                actionTextColor: '#fff'
              });
            });
          }else {
            error.errors.forEach(element => {
              Snackbar.show({
                text: `${element}`,
                showAction: true,
                actionText: '<i class="material-icons">close</i>',
                ppos: "top-right",
                actionTextColor: '#fff'
              });
            });
          }
        }
      });
  }

}
