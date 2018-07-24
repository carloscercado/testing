import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public errors: any;
  public errorsRegister: any;
  public dataRegister: any;
  public errorHttp: boolean = false;
  public loading: boolean = false;
  public user: any;

  constructor(private userService: UserService) { }
  forgotPassStepOne(){
    this.loading=true;
    this.errorsRegister = [];
    this.userService.forgotPasswordStepOne(this.user).subscribe(data => {

      var token, uid, client;
      this.loading=false;
      if("_body" in data){
        data=JSON.parse(data['_body']);
        console.log(data);
        data['data'].full_messages.forEach(element => {
          this.dataRegister.push(element);
        });
      }
    },
    error => {
      this.errorHttp = true; this.loading=false;
      if("_body" in error){
        error=JSON.parse(error._body);
        console.log(error);
        error.errors.full_messages.forEach(element => {
          this.errorsRegister.push(element);
        });
      }
    });
  }
  ngOnInit() {
  }

}
