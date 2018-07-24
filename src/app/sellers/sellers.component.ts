import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { API_ROUTES } from '../app.constants';
import { CONSTANTS } from '../app.constants';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import {CreateSellerComponent} from './create.component';
import {LoginComponent} from '../login/login.component'
import {AreYouSureSellerComponent} from './are-you-sure.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { CanActivate } from "@angular/router";
declare var Snackbar: any;

@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.component.html',
  styleUrls: ['./sellers.component.scss']
})
export class SellersComponent implements OnInit {
  public loading: boolean = false;
  public generalLoading: boolean = false;
  public errors: any=[];
  public user: any = {
    "user_id": JSON.parse(window.localStorage.getItem('user')).id,
    "type_profile": "seller",
    "title": "",
    "name": "",
    "email": "",
    "banner": "",
    "photo": null,
    "launched": null,
    "phone": null,
    "url": null,
    "address": null,
    "vision": null,
    "mission": null,
    "description": '',
    "web": null,
    "profile": null,
    "experience": null
  };
  public mySellers: any;
  public toggleView: boolean = true;
  public sellerSelected: any={};
  @ViewChild('modalCreateClose') modalCreateClose: ElementRef;

  constructor(
    public dialog: MatDialog,
   private _tokenService: Angular2TokenService) {
    this._tokenService.init({apiBase: CONSTANTS.BACK_URL});
  }

  ngOnInit() {
    console.log('re',this.dialog);
    this.mySellers=[];
    this.getMySellers();
  }
  openCreateSeller() {
    const dialogRef = this.dialog.open(CreateSellerComponent, {
      // height: '60%',
      width: '50%'
    });
    var object = this;
    dialogRef.afterClosed().subscribe(result => {
      object.getMySellers();
    });
  }

  selectSeller(seller){
    this.sellerSelected = seller;
  }
  deleteSeller(seller){
    let dialogRef = this.dialog.open(AreYouSureSellerComponent, {
      width: '300px',
      data: {
        seller: seller,
        passRequired: true,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMySellers();
    });

  }
  getMySellers(){
    this.mySellers=[]
    this.generalLoading=true;
    let object = this;
    let url = API_ROUTES.getMySellers();
    this._tokenService.get(url).subscribe(
      data =>      {
        data = JSON.parse(data['_body']);

        this.mySellers = data;
        console.log('my sellereeeees', this.mySellers)
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
