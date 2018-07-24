import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Angular2TokenService } from 'angular2-token';
import { ToastrService } from 'ngx-toastr';
import { API_ROUTES } from '../../../app.constants';
import { CONSTANTS } from '../../../app.constants';
import { ActivatedRoute } from '@angular/router';

// import {LoginComponent} from '../login/login.component'
declare var Snackbar: any;

@Component({
  selector: 'app-are-you-sure',
  templateUrl: './are-you-sure.component.html'
})
export class AreYouSureSellerProductsComponent {
  passRequired: boolean = false;
  password: string = "";
  errors: any = [];
  public sellerId: string = "";
  public myProducts: any;
  public loading: boolean = false;
  public generalLoading: boolean = false;
  constructor(public dialogRef: MatDialogRef<AreYouSureSellerProductsComponent>,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _tokenService: Angular2TokenService) {
      this._tokenService.init({apiBase: CONSTANTS.BACK_URL});
  }

  ngOnInit() {
    console.log('dataaaaaa',this.data)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDelete(){
    this.loading=true;
      let url = API_ROUTES.deleteSellersProducts().replace(":profile_id", this.data.sellerId).replace(":product_id", this.data.product.id);
      let object = this;
      this._tokenService.put(url, {current_password: this.password}).subscribe(
        data =>      {
          this.loading=false;
          Snackbar.show({
            text: "Producto Eliminado Exitosamente",
            showAction: true,
            actionText: '<i class="material-icons">close</i>',
            ppos: "top-right",
            actionTextColor: '#fff'
          });
          this.dialogRef.close();
          this.getMyProducts();
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
                text: "Error al eliminar el Producto, verifique su contraseña",
                showAction: true,
                actionText: '<i class="material-icons">close</i>',
                pos: "top-right",
                actionTextColor: '#fff'
              });
            }
            // this.toastr.error("Error al eliminar la Seller", 'Seller Error');
          }
          this.dialogRef.close();
        }
      );
  }

  getMyProducts(){
    this.myProducts=[]
    this.generalLoading=true;
    let object = this;
    let url = API_ROUTES.getSellerProducts().replace(":profile_id", this.data.sellerId);
    this._tokenService.get(url).subscribe(
      data =>      {
        data = JSON.parse(data['_body']);
        if (data['data'].length)
        this.myProducts = data['data'];
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
            text: "Revisa tu conexión a internet",
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
