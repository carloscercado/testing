import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { API_ROUTES } from '../app.constants';
import { CONSTANTS } from '../app.constants';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import {CreatePymeComponent} from './create.component';
import {LoginComponent} from '../login/login.component'
import {AreYouSureComponent} from './are-you-sure.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { CanActivate } from "@angular/router";
declare var Snackbar: any;

@Component({
  selector: 'app-pymes',
  templateUrl: './pymes.component.html',
  styleUrls: ['./pymes.component.scss']
})
export class PymesComponent implements OnInit {
  public loading: boolean = false;
  public generalLoading: boolean = false;
  public errors: any=[];
  public user: any = {
    "user_id": JSON.parse(window.localStorage.getItem('user')).id,
    "type_profile": "pyme",
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
  public myPymes: any;
  public toggleView: boolean = true;
  public pymeSelected: any={};
  @ViewChild('modalCreateClose') modalCreateClose: ElementRef;

  constructor(
    public dialog: MatDialog,
   private _tokenService: Angular2TokenService) {
    this._tokenService.init({apiBase: CONSTANTS.BACK_URL});
  }

  ngOnInit() {
    console.log('re',this.dialog);
    this.myPymes=[];
    this.getMyPymes();
  }
  openCreatePyme() {
    const dialogRef = this.dialog.open(CreatePymeComponent, {
      // height: '60%',
      width: '50%'
    });
    var object = this;
    dialogRef.afterClosed().subscribe(result => {
      object.getMyPymes();
    });
  }

  selectPyme(pyme){
    this.pymeSelected = pyme;
  }
  deletePyme(pyme){
    let dialogRef = this.dialog.open(AreYouSureComponent, {
      width: '300px',
      data: {
        pyme: pyme,
        passRequired: true,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMyPymes();
    });

  }
  getMyPymes(){
    this.myPymes=[]
    this.generalLoading=true;
    let object = this;
    let url = API_ROUTES.getMyPymes();
    this._tokenService.get(url).subscribe(
      data =>      {
        data = JSON.parse(data['_body']);
        if (data['data'].length)
        this.myPymes = data['data'];
        console.log('my pymeeeeees', this.myPymes)
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
