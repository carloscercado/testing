import { Component, OnInit, ViewChild, ElementRef, Inject, Input } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { API_ROUTES } from '../../../app.constants';
import { CONSTANTS } from '../../../app.constants';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {ENTER, COMMA} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import {FormControl} from '@angular/forms';
declare var Snackbar: any;

@Component({
  selector: 'show-independents-products',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})

export class ShowIndependentsProductsComponent implements OnInit {

  public subcategorys: any = ["63", "64"];
  public q: string = '';

  public loading: boolean = false;
  public generalLoading: boolean = false;
  public rangesLoading: boolean = false;
  public customLoading: boolean = false;
  public optionsLoading: boolean = false;
  public errors: any=[];
  public images: any = [];
  public tags: any=[];
  public toggleImage: boolean;
  public imageCache: any = '';
  public status: boolean = false;
  public independentId : string = '';
  public productId : any;
  public toggleView: boolean = true;
  public myProducts: any;
  public option: string = 'information';
  public options = [];
  public visible: boolean = true;
  public selectable: boolean = true;
  public removable: boolean = true;
  public addOnBlur: boolean = true;
  public ranges = [];
  public customField = [];
  public productOption = [];
  public price: number;
  public quantity: number;
  public pdfSrc: string = '';
  public product: any = {
    "name": "",
    "title": "",
    "description": "",
    "price": "",
    "tags": [],
    "category_ids": [],
    "status": "",
    "currency": '',
    "product-relations": [],
    "service_type": "",
    "virtual_product": "",
    "files": "",
    "bar_code": "",
    "document_data": [],
    "subcategory_ids": []
  };

  public customFields: any = {
    "name": "",
    "value": ""
  }

  public productOptions: any = {
    "name": "",
    "values": []
  }

  separatorKeysCodes = [ENTER, COMMA];

  moneyType = [
    {value: 'USD', viewValue: 'Dólares'},
    {value: 'BS', viewValue: 'Bolívares'}
  ];

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private _route: ActivatedRoute,
    private _tokenService: Angular2TokenService) {
      this._tokenService.init({apiBase: CONSTANTS.BACK_URL});
  }

  ngOnInit() {
    this.independentId = this._route.snapshot.paramMap.get('profile_id');
    this.productId = this._route.snapshot.paramMap.get('product_id');
    // this.product = [];
    // this.getProfile();
    this.getProduct();
    this.getCategories();
    this.getMyProducts();
  }

  add(event: MatChipInputEvent): void {
   let input = event.input;
   let value = event.value;

   // Add our fruit
   if ((value || '').trim()) {
     this.tags.push(value.trim());
     // this.product.attributes.tags.push({ name: value.trim() });
   }

   if (input) {
     input.value = '';
   }
 }

 remove(tag: any): void {
   let index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.product.attributes.tags.splice(index, 1);
    }
  }

  addRange(quantity, price) {
    this.rangesLoading=true;
    let object = this;
    let url = API_ROUTES.createRange().replace(":type_profile", "independents").replace(":profile_id", this.independentId).replace(":product_id",this.productId);
    let params = {"price_range": {"stock": this.quantity, "price": this.price }} //JSON.stringify(
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
        this.rangesLoading=false;
        // this.parent.toggleView = true;
        // this.parent.getMyProducts();
        this.ranges.push({price: this.price, stock: this.quantity})
        this.price = null;
        this.quantity = null;
        this.getProduct();

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
            text: "Error al crear el rango",
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

    this.product = [];
    this.rangesLoading=true;
    let object = this;
    let url = API_ROUTES.deletePriceRange().replace(':type_profile', 'independents').replace(':profile_id', this.independentId).replace(':product_id', this.productId).replace(':price_range_id', range.id);
    this._tokenService.delete(url).subscribe(
      data =>      {
        this.product = JSON.parse(data['_body']);
        this.product = this.product['data']
        // if (data['data'].length)
        // this.product = data['data'];

        if (index >= 0) {
          this.ranges.splice(index, 1);
          this.rangesLoading=false;
        }
        console.log('products', this.ranges);
        this.getProduct();
      },
      error =>  {
        this.generalLoading=false;
        if('_body' in error){
          error = error._body;
          if (error.errors && error.errors.full_messages){
            error.errors.full_messages.forEach(element => {
              object.errors.push(element);
            });
          }
          Snackbar.show({
            text: 'Revisa tu conexión a internet',
            showAction: true,
            actionText: '<i class="material-icons">close</i>',
            pos: 'top-right',
            actionTextColor: '#fff'
          });
        }
      }
    );
  }


  getProduct(){
    this.product = [];
    // this.generalLoading=true;
    let object = this;
    let url = API_ROUTES.getProduct().replace(':type_profile', 'independents').replace(':profile_id', this.independentId).replace(':product_id', this.productId);
    this._tokenService.get(url).subscribe(
      data =>      {
        this.product = JSON.parse(data['_body']);
        this.product = this.product['data']
        // if (data['data'].length)
        // this.product = data['data'];
        this.generalLoading=false;
        this.toggleImage = false;
        this.ranges = this.product.attributes['price_ranges'].map(function(val) {
          return {"id": val.id, "price": val.price, "stock": val.stock}
        })

        this.customField = this.product.attributes['custom_fields'].map(function(val) {
          return {"id": val.id, "name": val.name, "value": val.value}
        })

        this.productOption = this.product.attributes.options.map(function(val) {
          return {"id": val.id, "name": val.name, "values": val.values}
        })

        // this.subcategorys = this.product.attributes.subcategories.map(function(val) {
        //   return val.id.toString();
        // })
        //
        // console.log(':::::::::::::::::::::: subcategories', this.subcategory_ids)
        this.tags = this.product.attributes.tags.map(function(val) {
          return val.name
        })

        console.log('products', this.ranges);
        console.log('taaaaaaaags', this.tags);
      },
      error =>  {
        this.generalLoading=false;
        if('_body' in error){
          error = error._body;
          if (error.errors && error.errors.full_messages){
            error.errors.full_messages.forEach(element => {
              object.errors.push(element);
            });
          }
          Snackbar.show({
            text: 'Revisa tu conexión a internet',
            showAction: true,
            actionText: '<i class="material-icons">close</i>',
            pos: 'top-right',
            actionTextColor: '#fff'
          });
        }
      }
    );
  }

  updateProduct(){
    var object = this;
    object.errors=[];
    this.loading=true;
    this.product.attributes.tags = this.tags;
    // this.userService.user = this.user;
    let url = API_ROUTES.updateProduct().replace(':type_profile', "independents").replace(':profile_id', this.independentId).replace(':product_id', this.productId);
    // let subcategories = { "subcategory_ids": this.subcategorys }
    // console.log(':::::::::::::::::', subcategories)
    // let product = Object.assign(this.product.attributes, subcategories);
    // console.log(':::::::::::::::::', product)
    let params = {"product": this.product.attributes}
    console.log('product params', params)
    this._tokenService.put(url, params).subscribe(
      data =>      {
        data = JSON.parse(data['_body']);
        console.log('data:: ', data);
        this.product = data['data'];
        // Object.assign({}, this.product, data['data']);
        Snackbar.show({
          text: 'Producto actualizado exitosamente',
          showAction: true,
          actionText: '<i class="material-icons">close</i>',
          pos: 'top-right',
          actionTextColor: '#fff'
        });
        this.loading=false;
      },
      error => {
        this.loading=false;
        if('_body' in error){
          error=JSON.parse(error._body);
          console.log(error);
          console.log(object);
          if (error.errors.full_messages){
            error.errors.full_messages.forEach(element => {
              Snackbar.show({
                text: `${element}`,
                showAction: true,
                actionText: '<i class="material-icons">close</i>',
                ppos: 'top-right',
                actionTextColor: '#fff'
              });
            });
          } else {
            error.errors.forEach(element => {
              Snackbar.show({
                text: `${element}`,
                showAction: true,
                actionText: '<i class="material-icons">close</i>',
                ppos: 'top-right',
                actionTextColor: '#fff'
              });
            });
          }
        }
      });
  }

  getMyProducts(){
    this.myProducts=[]
    // this.generalLoading=true;
    let object = this;
    let url = API_ROUTES.getIndependentProducts().replace(":profile_id", this.independentId);
    this._tokenService.get(url).subscribe(
      data =>      {
        data = JSON.parse(data['_body']);
        if (data['data'].length)
        this.myProducts = data['data'];

        this.myProducts = this.myProducts.filter(p => p.id != this.productId);
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

  getCategories(){
    this.generalLoading=true;
    let object = this;
    let url = API_ROUTES.getSubcategories().replace(':profile_id', this.independentId);
    this._tokenService.get(url).subscribe(
      data =>      {
        this.options = JSON.parse(data['_body']);
        console.log('optionsssssssssssssssssssssss',this.options)
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


  createCustomField() {
    console.log(this.customFields)
    // this.generalLoading=true;
    this.customLoading = true;
    let object = this;
    let url = API_ROUTES.productCreateCustomFields().replace(':type_profile', "independents").replace(':profile_id', this.independentId).replace(':product_id', this.productId);
    let params = {"custom_fields": this.customFields }
    this._tokenService.post(url, params).subscribe(
      data =>      {
        this.options = JSON.parse(data['_body']);
        console.log('optionsssssssssssssssssssssss',this.options);
        this.customLoading = false;
        this.customFields = [];
        this.getProduct();
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

  removeCustomField(custom: any): void {
    let index = this.customField.indexOf(custom);

    this.product = [];
    this.customLoading = true;
    let object = this;
    let url = API_ROUTES.productDeleteCustomFields().replace(':type_profile', 'independents').replace(':profile_id', this.independentId).replace(':product_id', this.productId).replace(':custom_field_id', custom.id);
    this._tokenService.delete(url).subscribe(
      data =>      {
        this.product = JSON.parse(data['_body']);
        this.product = this.product['data']

        if (index >= 0) {
          this.customField.splice(index, 1);
        }
        this.customLoading = false;
        this.getProduct();
      },
      error =>  {
        this.generalLoading=false;
        if('_body' in error){
          error = error._body;
          if (error.errors && error.errors.full_messages){
            error.errors.full_messages.forEach(element => {
              object.errors.push(element);
            });
          }
          Snackbar.show({
            text: 'Revisa tu conexión a internet',
            showAction: true,
            actionText: '<i class="material-icons">close</i>',
            pos: 'top-right',
            actionTextColor: '#fff'
          });
        }
      }
    );
  }

  addOption(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

     // Add our fruit
     if ((value || '').trim()) {
       this.productOptions.values.push(value.trim());
       // this.product.attributes.tags.push({ name: value.trim() });
     }

     if (input) {
       input.value = '';
     }
   }

   removeOption(option: any): void {
     let index = this.productOptions.values.indexOf(option);

      if (index >= 0) {
        this.productOptions.values.splice(index, 1);
      }
      this.optionsLoading = false;
    }

  createOption() {
    console.log(this.productOptions)
    this.optionsLoading = true;
    let object = this;
    let url = API_ROUTES.productCreateOptions().replace(':type_profile', "independents").replace(':profile_id', this.independentId).replace(':product_id', this.productId);
    let params = {"options": this.productOptions }
    this._tokenService.post(url, params).subscribe(
      data =>      {
        this.options = JSON.parse(data['_body']);
        console.log('optionsssssssssssssssssssssss',this.options);
        this.optionsLoading = false;
        this.productOptions = [];
        this.getProduct();
      },
      error =>  {
        // this.generalLoading=false;
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

  deleteOption(option: any): void {
    let index = this.productOption.indexOf(option);
    this.optionsLoading = true;
    let object = this;
    let url = API_ROUTES.productDeleteOptions().replace(':type_profile', 'independents').replace(':profile_id', this.independentId).replace(':product_id', this.productId).replace(':option_id', option.id);
    this._tokenService.delete(url).subscribe(
      data =>      {
        this.product = JSON.parse(data['_body']);
        this.product = this.product['data']

        this.optionsLoading = false;
        if (index >= 0) {
          this.productOption.splice(index, 1);
        }
        console.log('options', this.productOption);
        // this.getProduct();
      },
      error =>  {
        // this.generalLoading=false;
        if('_body' in error){
          error = error._body;
          if (error.errors && error.errors.full_messages){
            error.errors.full_messages.forEach(element => {
              object.errors.push(element);
            });
          }
          Snackbar.show({
            text: 'Revisa tu conexión a internet',
            showAction: true,
            actionText: '<i class="material-icons">close</i>',
            pos: 'top-right',
            actionTextColor: '#fff'
          });
        }
      }
    );
  }

  getBase64(file) {
     var reader = new FileReader();
     reader.readAsDataURL(file);
     reader.onload = function () {
       console.log(reader.result);
     };
     reader.onerror = function (error) {
       console.log('Error: ', error);
     };
   }

  onChange(event: any, input: any) {
    this.product.attributes.document_data = [].slice.call(event.target.files);

    input.value = this.product.attributes.document_data.map(f => f.name).join(', ');
    console.log('asdasajaxb<zbx<znbx<', this.product.attributes)
  }

  // onChange(event: any, input: any) {
  //   let files = [].slice.call(event.target.files);
  //   this.product.attributes.files = files.map(file => this.getBase64(file))
  //
  //   // input.value = this.product.attributes.files.map(f => f.name).join(', ');
  //   console.log('asdasajaxb<zbx<znbx<', this.product.attributes)
  // }

  back() {
    this.router.navigate([`/admin/independent/${this.independentId}`], { queryParams: {tab: "products"} });
  }

  onSelectFile(event) { // called each time file input changes
   if (event.target.files && event.target.files[0]) {
     this.toggleImage = true;
     var reader = new FileReader();
     var readerFiles = new FileReader();
     // this.product.attributes.cover.url = event.target.files[0];
     reader.readAsDataURL(event.target.files[0]); // read file as data url

     reader.onload = (event) => { // called once readAsDataURL is completed
       let target: any = event.target; //<-- This (any) will tell compiler to shut up!
       let content: string = target.result;
       this.imageCache = content;
       this.product.attributes.cover = content;
     }

     console.log(event.target.files)
   }
 }

 // filterCategories() {
 //   alert(1)
 //   this.options = this.options.filter(op => op.includes('a'));
 // }

 detectFiles(event) {
  this.images = [];
  let files = event.target.files;
  if (files) {
    for (let file of files) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.images.push(e.target.result);
      }
        reader.readAsDataURL(file);
      }
    }
    console.log(this.images)
  }
}
