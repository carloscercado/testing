import { Component, OnInit, ViewChild, ElementRef, Inject, Input } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { API_ROUTES } from '../../../app.constants';
import { CONSTANTS } from '../../../app.constants';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { CreateSellerProductsComponent } from './create.component';
import { ActivatedRoute } from '@angular/router';

// import {LoginComponent} from '../login/login.component'
import {AreYouSureSellerProductsComponent} from './are-you-sure.component';
// import { ChangeDetectionStrategy } from '@angular/core';
// import { CanActivate } from "@angular/router";
declare var Snackbar: any;

@Component({
  selector: 'admin-sellers-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsSellerComponent implements OnInit {
  public loading: boolean = false;
  public generalLoading: boolean = false;
  public errors: any=[];

  @Input() sellerId : string = "";
  public myProducts: any;
  public toggleView: boolean = true;
  public productSelected: any={};
  @ViewChild('modalCreateClose') modalCreateClose: ElementRef;

  constructor(
    public dialog: MatDialog,
    private _route: ActivatedRoute,
   private _tokenService: Angular2TokenService) {
    this._tokenService.init({apiBase: CONSTANTS.BACK_URL});
    this._route.queryParams.subscribe(params => {
      if ('tab' in params)
        if (params['tab'] == 'products') {
          this.toggleView = true;
        }

      console.log(params)
    });
  }

  ngOnInit() {
    this.myProducts=[];
    this.getMyProducts();

    this._route.queryParams.subscribe(params => {
      if ('tab' in params)
        if (params['tab'] == 'products') {
          this.toggleView = true;
        }

      console.log(params)
    });
  }
  selectProduct(product){
    this.productSelected = product;
  }

  deleteProduct(product, sellerId){
    let dialogRef = this.dialog.open(AreYouSureSellerProductsComponent, {
      width: '300px',
      data: {
        product: product,
        sellerId: sellerId,
        passRequired: true,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMyProducts();
    });

  }

  getMyProducts(){
    this.myProducts=[]
    this.generalLoading=true;
    let object = this;
    let url = API_ROUTES.getSellerProducts().replace(":profile_id", this.sellerId);
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
