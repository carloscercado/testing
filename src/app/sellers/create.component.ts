import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { API_ROUTES } from '../app.constants';
import { CONSTANTS } from '../app.constants';
import { Router } from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ENTER, COMMA} from '@angular/cdk/keycodes';

declare var Snackbar: any;
@Component({
  selector: 'app-create-sellers',
  templateUrl: './create.component.html',
//   styleUrls: ['./sellerss.component.scss']
})

export class CreateSellerComponent implements OnInit {
  public loading: boolean = false;
  public generalLoading: boolean = false;
  public errors: any=[];
  public options: any = [];
  // filteredBrandOptions: Observable<string[]>;

  public profile: any = {
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
    "experience": null,
    "category_ids": []
  };

  separatorKeysCodes = [ENTER, COMMA];
  filteredOptions: Observable<string[]>;

  myControl: FormControl = new FormControl();
  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    return this.email.hasError('required') ? 'Ingresa un valor' :
      this.email.hasError('email') ? 'Email inválido' : '';
  }

  public mySellers: any;
  public currentModal: string;
  public sellersSelected: any={};

  constructor(
    private router: Router,
    private _tokenService: Angular2TokenService) {
    this._tokenService.init({apiBase: CONSTANTS.BACK_URL});
    this.mySellers=[]
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
    };
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
     .pipe(
       startWith(''),
       map(val => this.filter(val))
     );


    this.getCategories()
  }

  filter(val: string): string[] {
    return this.options.filter(option =>
      option.name.toLowerCase().includes(val.toLowerCase()));
  }

  createSeller(){
    this.loading=true;
    let object = this;
    let url = API_ROUTES.createSeller();
    let params= {"profile": this.profile} //JSON.stringify(
    console.log('sellers params', params)
    this._tokenService.post(url, params).subscribe(
      data =>      {
        data = JSON.parse(data['_body']);
        Snackbar.show({
          text: "Tienda Creada Exitosamente",
          showAction: true,
          actionText: '<i class="material-icons">close</i>',
          ppos: "top-right",
          actionTextColor: '#fff'
        });

        this.loading=false;
        this.router.navigate(['/profile'], {queryParams: {tab: "sellerss"}});
      },
      error =>   {
        this.loading=false;
        if("_body" in error){
          error = error._body;
          console.log("error: ",error);
          if (error.errors && error.errors.full_messages){
            error.errors.full_messages.forEach(element => {
              object.errors.push(element);
            });
          }
          Snackbar.show({
            text: "Error al crear la Seller",
            showAction: true,
            actionText: '<i class="material-icons">close</i>',
            pos: "top-right",
            actionTextColor: '#fff'
          });
        }
      }
    );
  }

  getMySellers(){
    this.generalLoading=true;
    let object = this;
    let url = API_ROUTES.getMySellers();
    console.log(url);
    this._tokenService.get(url).subscribe(
      data =>      {
        data = JSON.parse(data['_body']);
        console.log(data);
        if (data['data'].length)
        this.mySellers = data['data'];
        this.generalLoading=false;
      },
      error =>  {
        this.generalLoading=false;
        if("_body" in error){
          error = error._body;
          console.log("error: ",error);
          if (error.errors && error.errors.full_messages){
            error.errors.full_messages.forEach(element => {
              object.errors.push(element);
            });
          }
          // this.toastr.error("Error al obtener las Sellers", 'Seller Error');
        }
      }
    );
  }

  getCategories(){
    this.generalLoading=true;
    let object = this;
    let url = API_ROUTES.getCategories();
    console.log(url);
    this._tokenService.get(url).subscribe(
      data =>      {
        data = JSON.parse(data['_body']);
        console.log(data);
        if (data['data'].length)
        this.options = data['data'];

        console.log('originaaaaaaaaaaaaaaaaaaaal', this.options)
        this.options = this.options.map(function(op) {
          return {"id": op.id, "name": op.attributes.name, "subcategories": op.attributes.subcategories }
        })

        console.log('options',this.options)
        this.generalLoading=false;
      },
      error =>  {
        this.generalLoading=false;
        if("_body" in error){
          error = error._body;
          console.log("error: ",error);
          if (error.errors && error.errors.full_messages){
            error.errors.full_messages.forEach(element => {
              object.errors.push(element);
            });
          }
          // this.toastr.error("Error al obtener las Sellers", 'Seller Error');
        }
      }
    );
  }
}
