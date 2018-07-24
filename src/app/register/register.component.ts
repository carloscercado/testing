import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Angular2TokenService } from 'angular2-token';
import { CONSTANTS } from '../app.constants';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


declare var Snackbar: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    options: FormGroup;
  public user: any = {
    nickname: '',
    email: '',
    name: '',
    password: '',
    password_confirmation: ''
  };
  public errors: any;
  public errorsRegister: any;
  public errorHttp: boolean = false;
  public loading: boolean = false
  public hidePassword: boolean = true;
  public hidePasswordConfirmation: boolean = true;
  constructor(
    public dialogRef: MatDialogRef<RegisterComponent>,
    fb: FormBuilder, private userService: UserService, private router: Router,
    private _tokenService: Angular2TokenService) {
      this.router = router;
      this._tokenService.init({apiBase: CONSTANTS.BACK_URL});
    if (this._tokenService.userSignedIn()){
      this.router.navigate(['/']);
    }
    this._tokenService.currentUserType;
    this.options = fb.group({
        hideRequired: false,
        floatLabel: 'auto',
      });
    this.errors = this.userService.errors;
    if(window.localStorage.getItem('user')){
      this.user=JSON.parse(window.localStorage.getItem('user'));
    }
  }

  ngOnInit() {
  }
  onDialogClose(): void {
    this.dialogRef.close();
  }
  registerUser(){
    this.loading=true;
    this.errorsRegister = [];
    this.userService.user = this.user;
    this._tokenService.registerAccount({
      name:                 this.user.name,
      nickname:             this.user.nickname,
      email:                this.user.email,
      password:             this.user.password,
      passwordConfirmation: this.user.password_confirmation
  }).subscribe(
      data => {
        console.log("data:", data)
        data = JSON.parse(data['_body']);
        this.user = data['data'];
        window.localStorage.setItem('user', JSON.stringify(this.user));
        this.onDialogClose();
        this.loading=false;

      },
      error => {
        this.errorHttp = true; this.loading=false;
        if("_body" in error){
          error=JSON.parse(error._body);
          console.log(error);
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
    );
  }

}
