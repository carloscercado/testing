import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Angular2TokenService } from 'angular2-token';
import { ToastrService } from 'ngx-toastr';
import { API_ROUTES } from '../app.constants';
import { CONSTANTS } from '../app.constants';
import {LoginComponent} from '../login/login.component'
declare var Snackbar: any;

@Component({
  selector: 'app-are-you-sure',
  templateUrl: './are-you-sure.component.html'
})
export class AreYouSureIndependentComponent {
  passRequired: boolean = false;
  password: string = "";
  errors: any = [];
  public myIndependents: any;
  public loading: boolean = false;
  public generalLoading: boolean = false;
  constructor(public dialogRef: MatDialogRef<AreYouSureIndependentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _tokenService: Angular2TokenService) {
      this._tokenService.init({apiBase: CONSTANTS.BACK_URL});
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onDelete(){
    this.loading=true;
      let url = API_ROUTES.deleteIndependent().replace(":independent_id", this.data.independent.id);
      let object = this;
      this._tokenService.put(url, {current_password: this.password}).subscribe(
        data =>      {
          this.loading=false;
          Snackbar.show({
            text: "Tienda Eliminada Exitosamente",
            showAction: true,
            actionText: '<i class="material-icons">close</i>',
            ppos: "top-right",
            actionTextColor: '#fff'
          });
          this.dialogRef.close();
          this.getMyIndependents();
        },
        error =>   {
          this.loading=false;
          if("_body" in error){
            error = JSON.parse(error._body);
            if (error.lenght){
              error.error.forEach(element => {
                object.errors.push(element);
                Snackbar.show({
                  text: element,
                  showAction: true,
                  actionText: '<i class="material-icons">close</i>',
                  pos: "top-right",
                  actionTextColor: '#fff'
                });
              });
            }else{
              Snackbar.show({
                text: "Error al eliminar la Tienda, verifique su contraseña",
                showAction: true,
                actionText: '<i class="material-icons">close</i>',
                pos: "top-right",
                actionTextColor: '#fff'
              });
            }
            // this.toastr.error("Error al eliminar la Independent", 'Independent Error');
          }
          this.dialogRef.close();
        }
      );
  }

  getMyIndependents(){
    this.myIndependents=[]
    this.generalLoading=true;
    let object = this;
    let url = API_ROUTES.getMyIndependents();
    this._tokenService.get(url).subscribe(
      data =>      {
        data = JSON.parse(data['_body']);
        if (data['data'].length)
        this.myIndependents = data['data'];
        this.generalLoading=false;
      },
      error =>  {
        this.generalLoading=false;
        if("_body" in error){
          error = error._body;
          if (error.errors && error.errors.full_messages){
            error.errors.full_messages.forEach(element => {
              object.errors.push(element);
            });
          }
          Snackbar.show({
            text: "Error al obtener las Tiendas",
            showAction: true,
            actionText: '<i class="material-icons">close</i>',
            pos: "top-right",
            actionTextColor: '#fff'
          });
        }
      }
    );
  }
}
