import { Component, OnInit, ViewChild, ElementRef, Inject, Input } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { API_ROUTES } from '../../../app.constants';
import { CONSTANTS } from '../../../app.constants';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductsIndependentComponent } from '../products/products.component';
import {ENTER, COMMA} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

declare var Snackbar: any;

@Component({
  selector: 'admin-create-independent-products',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

export class CreateIndependentProductsComponent implements OnInit {
  public loading: boolean = false;
  public generalLoading: boolean = false;
  public errors: any=[];
  public visible: boolean = true;
  public selectable: boolean = true;
  public removable: boolean = true;
  public addOnBlur: boolean = true;
  public typeMoney : string = '';
  public value = [];
  public options = [];
  public subcategories = [];
  public ranges = [];
  public price: 0;
  public stock: 0;
  public myProducts: any;
  public productList: any = [];
  public selectedValue: string = "";
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  separatorKeysCodes = [ENTER, COMMA];

  myControl: FormControl = new FormControl();
  myControlBrand: FormControl = new FormControl();

  brands = [
    'Brand 1',
    'Brand 2',
    'Brand 3',
    'Brand 4',
    'Brand 5'
  ];

  filteredOptions: Observable<string[]>;
  filteredBrandOptions: Observable<string[]>;

  @Input() independentId : string = "";
  public product: any = {
    "name": "",
    "title": "",
    "description": "",
    "price": "",
    "tags": [],
    "subcategory_ids": [],
    "status": "",
    "currency": ''
  };

  public currentModal: string;
  public independentSelected: any={};

  constructor(
    private router: Router,
    private parent: ProductsIndependentComponent,
    private _tokenService: Angular2TokenService,
    private activatedRoute: ActivatedRoute) {
    this._tokenService.init({apiBase: CONSTANTS.BACK_URL});
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );

    this.filteredBrandOptions = this.myControlBrand.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterBrand(val))
      );

    this.getCategories();
    this.getMyProducts();
  }

  addProductId(id) {
    this.productList.push(id);
  }

  addRange(stock, price) {
    this.loading=true;
    let object = this;
    let url = API_ROUTES.createRange().replace(":type_profile", "independents").replace(":profile_id", this.independentId).replace(":product_id", '153');
    let params = {"price_range": {"stock": this.stock, "price": this.price }} //JSON.stringify(
    this._tokenService.post(url, params).subscribe(
      data =>      {
        data = JSON.parse(data['_body']);
        // window.localStorage.setItem('user', JSON.stringify(this.user));
        Snackbar.show({
          text: "Rango Creado Exitosamente",
          showAction: true,
          actionText: '<i class="material-icons">close</i>',
          ppos: "top-right",
          actionTextColor: '#fff'
        });

        this.loading=false;
        // this.parent.toggleView = true;
        // this.parent.getMyProducts();
        this.ranges.push({price: this.price, stock: this.stock})
        this.price = null;
        this.stock = null;

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
            text: "Error al crear la Tienda",
            showAction: true,
            actionText: '<i class="material-icons">close</i>',
            pos: "top-right",
            actionTextColor: '#fff'
          });
        }
      }
    );
  }

  removeRange(range: any): void {
    let index = this.ranges.indexOf(range);

    if (index >= 0) {
      this.ranges.splice(index, 1);
    }
  }

  filter(val: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().includes(val.toLowerCase()));
  }

  filterBrand(val: string): string[] {
    return this.brands.filter(brand =>
      brand.toLowerCase().includes(val.toLowerCase()));
  }

  moneyType = [
    {value: 'USD', viewValue: 'Dólares'},
    {value: 'BS', viewValue: 'Bolívares'}
  ];

  add(event: MatChipInputEvent): void {
   let input = event.input;
   let value = event.value;

   // Add our fruit
   if ((value || '').trim()) {
     this.product.tags.push({ name: value.trim() });
   }

   // Reset the input value
   if (input) {
     input.value = '';
   }
 }

 remove(tag: any): void {
   let index = this.product.tags.indexOf(tag);

    if (index >= 0) {
      this.product.tags.splice(index, 1);
    }
  }

  createProduct() {
    this.loading=true;
    let object = this;
    let url = API_ROUTES.createProductsIndependent().replace(":type_profile", "independents").replace(":id_profile", this.independentId);
    let params = {"product": this.product} //JSON.stringify(
    console.log('product params', this.product)
    console.log(url)
    this._tokenService.post(url, params).subscribe(
      data =>      {
        data = JSON.parse(data['_body']);
        console.log('data::', data);
        // window.localStorage.setItem('user', JSON.stringify(this.user));
        Snackbar.show({
          text: "Producto Creado Exitosamente",
          showAction: true,
          actionText: '<i class="material-icons">close</i>',
          ppos: "top-right",
          actionTextColor: '#fff'
        });

        this.loading=false;
        this.parent.toggleView = true;
        this.parent.getMyProducts();
        // this.router.navigate([`/admin/independent/${this.independentId}`], { queryParams: {tab: "products"} });
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
            text: "Error al crear el producto",
            showAction: true,
            actionText: '<i class="material-icons">close</i>',
            pos: "top-right",
            actionTextColor: '#fff'
          });
        }
      }
    );
  }

  getCategories(){
    this.generalLoading=true;
    let object = this;
    let url = API_ROUTES.getSubcategories().replace(':profile_id', this.independentId);
    this._tokenService.get(url).subscribe(
      data =>      {
        this.subcategories = JSON.parse(data['_body']);
        console.log('optionsssssssssssssssssssssss',this.subcategories)
        // console.log('categories',this.categories)
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
          // this.toastr.error("Error al obtener las Independents", 'Independent Error');
        }
      }
    );
  }

  products = new FormControl();

  getMyProducts(){
    this.myProducts=[]
    this.generalLoading=true;
    let object = this;
    let url = API_ROUTES.getIndependentProducts().replace(":profile_id", this.independentId);
    this._tokenService.get(url).subscribe(
      data =>      {
        data = JSON.parse(data['_body']);
        if (data['data'].length)
        this.myProducts = data['data'];

        console.log('products', this.myProducts)
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
