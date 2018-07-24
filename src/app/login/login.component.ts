import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Angular2TokenService } from 'angular2-token';
import { CONSTANTS } from '../app.constants';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {RegisterComponent} from '../register/register.component';


declare var Snackbar: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  // styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public user: any = {
    nickname: '',
    email: '',
    name: '',
    password: '',
    password_confirmation: '',
    avatar: {
      url: ''
    }
  };

  public errors: any;
  public errorsRegister: any;
  public errorHttp: boolean = false;
  public loading: boolean = false

  constructor(private userService: UserService, private router: Router,
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _tokenService: Angular2TokenService) {
    this._tokenService.init({apiBase: CONSTANTS.BACK_URL});
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
    };
    this._tokenService.currentUserType;
    this.errors = this.userService.errors;
    if(window.localStorage.getItem('user')){
      this.user=JSON.parse(window.localStorage.getItem('user'));
    }
  }

  onNoClick(): void {
    //this.data = this.user;
   
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  loginUser(){
    let object = this;
    this.errors=[];
    this.loading=true;
    this.userService.user = this.user;
    this._tokenService.signIn({
      email:    this.user.email,
      password: this.user.password,
    }).subscribe(
      data => {
        this.loading = false;
        var token, uid, client;
        data = JSON.parse(data['_body']);
        this.user = data['data'];
        window.localStorage.setItem('user', JSON.stringify(this.user));
        this.router.navigated = false;
        this.onNoClick();
        // this.router.navigate(['/']);

        setTimeout(function() {
          Snackbar.show({
            text: `Bienvenido ${JSON.parse(window.localStorage.getItem('user')).name}`,
            showAction: true,
            actionText: '<i class="material-icons">close</i>',
            pos: "top-right",
            actionTextColor: '#fff'
          });
        }, 1000)
      },
      error =>    {
        this.loading=false;
        this.errorHttp = true;
        this.loading=false;
        console.log(error);
        if (error && '_body' in error){
          try{

            error = JSON.parse(error._body);
            if (error && error.errors){
              error.errors.forEach(element => {
                // object.errors.push(element);
                Snackbar.show({
                  text: `${element}`,
                  showAction: true,
                  actionText: '<i class="material-icons">close</i>',
                  pos: "top-right",
                  actionTextColor: '#fff'
                });
              });
            }
            else{
              // object.errors.push("Verifique su usuario y contraseña");
              Snackbar.show({
                text: "Verifique su usuario y contraseña",
                showAction: true,
                actionText: '<i class="material-icons">close</i>',
                pos: "top-right",
                actionTextColor: '#fff'
              });
            }
          }catch(err){
            console.log(err)
            // object.errors.push("Verifique su usuario y contraseña");
            Snackbar.show({
              text: "Verifique su usuario y contraseña",
              showAction: true,
              actionText: '<i class="material-icons">close</i>',
              pos: "top-right",
              actionTextColor: '#fff'
            });
          }
        }else{
          // object.errors.push("Intente mas tarde");
          Snackbar.show({
            text: "Intente mas tarde",
            showAction: true,
            actionText: '<i class="material-icons">close</i>',
            pos: "top-right",
            actionTextColor: '#fff'
          });
        }
      }
    );
  }

  openRegisterDialog() {
    const dialogRef = this.dialog.open(RegisterComponent, {
      // height: '60%',
      width: '50%'
    });
  }


}
