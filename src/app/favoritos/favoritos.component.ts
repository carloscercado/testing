import { CreatewishComponent } from './create_wish/create_wish.component';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { WishesService, Wish } from './../services/wishes.component';
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
import {LoginComponent} from '../login/login.component';


declare var Snackbar: any;

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})


export class FavoritosComponent implements OnInit {

  wishes: Wish[] = [];

  constructor(private _wishesService: WishesService,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) private data: any) {
    }

  ngOnInit() {

    this.wishes = this._wishesService.getWishes();
    console.log(this.wishes);
  }
  openWishDialog() {
    const dialogRef = this.dialog.open(CreatewishComponent, {
      // height: '60%',
      width: '50%'
    });
  }
}
