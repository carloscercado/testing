import { Component, OnInit, ViewChild, ElementRef, Inject, Input } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { API_ROUTES } from '../../../app.constants';
import { CONSTANTS } from '../../../app.constants';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductsPymeComponent } from '../products/products.component';
import {ENTER, COMMA} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';

import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export const _filter = (opt: any[], value: string): any[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.name.toLowerCase().indexOf(filterValue) === 0);
};

export interface Categories {
  category: string;
  subcategories: string[];
}

declare var Snackbar: any;

@Component({
  selector: 'admin-create-pyme-products',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

export class CreatePymeProductsComponent implements OnInit {
  stateForm: FormGroup = this.fb.group({
    stateGroup: '',
  });

  stateGroupOptions: Observable<Categories[]>;

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
  public categoryName: string = "";
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

  @Input() pymeId : string = "";
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
  public pymeSelected: any={};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private parent: ProductsPymeComponent,
    private _tokenService: Angular2TokenService,
    private activatedRoute: ActivatedRoute) {
    this._tokenService.init({apiBase: CONSTANTS.BACK_URL});
  }

  ngOnInit() {
    this.stateGroupOptions = this.stateForm.get('stateGroup')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );

    this.getCategories();
    this.getMyProducts();
  }

  private _filterGroup(value: string): Categories[] {

    if (value) {
      return this.options
        .map(c => ({ category: c.category, subcategories: _filter(c.subcategories, value)}))
        .filter(c => c.subcategories.length > 0);
    }

    return this.options;
  }

  addProductId(id) {
    this.productList.push(id);
  }

  addRange(stock, price) {
    this.loading=true;
    let object = this;
    let url = API_ROUTES.createRange().replace(":type_profile", "pymes").replace(":profile_id", this.pymeId).replace(":product_id", '153');
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

    if (!this.product.name) {
      Snackbar.show({
        text: 'El nombre no puede estar vacío',
        showAction: true,
        actionText: '<i class="material-icons">close</i>',
        pos: "top-right",
        actionTextColor: '#fff'
      });
    }
    else if (!this.product.price) {
      Snackbar.show({
        text: 'Debe agregar un precio al producto',
        showAction: true,
        actionText: '<i class="material-icons">close</i>',
        pos: "top-right",
        actionTextColor: '#fff'
      });
    }
    else if (!this.product['subcategory_ids'].length) {
      Snackbar.show({
        text: 'Debe agregar al menos una subcategoría',
        showAction: true,
        actionText: '<i class="material-icons">close</i>',
        pos: "top-right",
        actionTextColor: '#fff'
      });
    }
    else {
      this.loading=true;
      let object = this;
      let url = API_ROUTES.createProductsPyme().replace(":type_profile", "pymes").replace(":id_profile", this.pymeId);
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
          // this.router.navigate([`/admin/pyme/${this.pymeId}`], { queryParams: {tab: "products"} });
        },
        error =>   {
          this.loading=false;
          if("_body" in error){
            error = error._body;
            console.log("error: ",error);
            console.log("error: ",error.name);
            if (error.errors && error.errors.full_messages){
              error.forEach(element => {
                // object.errors.push(element);
                Snackbar.show({
                  text: `${element}`,
                  showAction: true,
                  actionText: '<i class="material-icons">close</i>',
                  pos: "top-right",
                  actionTextColor: '#fff'
                });
              });
            }
          }
        }
      );
    }
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
          return {category: op.attributes.name, subcategories: op.attributes.subcategories.map(function(s) {
            return {name: s.name, id: s.id}
          }) }
        })

        console.log('optionsssssssssssssssssssssss',this.options)
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
          // this.toastr.error("Error al obtener las Pymes", 'Pyme Error');
        }
      }
    );
  }

  products = new FormControl();

  getMyProducts(){
    this.myProducts=[]
    this.generalLoading=true;
    let object = this;
    let url = API_ROUTES.getPymeProducts().replace(":profile_id", this.pymeId);
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

  addSubcategory(subcategory): void {
    var flag = true;
    this.subcategories.forEach(function(s) {
      if (s.name == subcategory.name) {
        Snackbar.show({
          text: "Ya se agregó esta Categoría",
          showAction: true,
          actionText: '<i class="material-icons">close</i>',
          ppos: "top-right",
          actionTextColor: '#fff'
        });
        flag = false;
      }
    })
    this.categoryName = '';

    if (flag) {
      this.subcategories.push({name: subcategory.name, id: subcategory.id.toString()})
      this.product['subcategory_ids'].push(subcategory.id.toString())
    }
    this.categoryName = '';
   }

removeSubcategory(subcategory: any, subcategoryId): void {
  let index = this.subcategories.indexOf(subcategory);

  if (index >= 0) {
    this.subcategories.splice(index, 1);
  }

  console.log('subcategory names', this.subcategories);
  console.log('subcategory ids', this.product.attributes['subcategory_ids']);
}
}
