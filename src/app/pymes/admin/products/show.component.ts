import { Component, OnInit, ViewChild, ElementRef, Inject, Input } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { API_ROUTES } from '../../../app.constants';
import { CONSTANTS } from '../../../app.constants';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {ENTER, COMMA} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
declare var Snackbar: any;
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';

export const _filter = (opt: any[], value: string): any[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.name.toLowerCase().indexOf(filterValue) === 0);
};

export interface Categories {
  category: string;
  subcategories: string[];
}

@Component({
  selector: 'show-pymes-products',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})

export class ShowPymesProductsComponent implements OnInit {

  stateForm: FormGroup = this.fb.group({
    stateGroup: '',
  });

  stateGroupOptions: Observable<Categories[]>;

  public subcategories: any = [];
  public customAndOptions: any = [];
  public productRelations: any = [];
  public allCustomFields: any = [];
  public documentNames: any = [];
  public allOptions: any = [];
  public customFieldIds: any = [];
  public productOptionIds: any = [];
  public productOption: any = [];
  public productCustomFields: any = [];
  public productAllOptions: any = [];
  public categoryName: string = '';
  public loading: boolean = false;
  public generalLoading: boolean = false;
  public rangesLoading: boolean = false;
  public customLoading: boolean = false;
  public optionsLoading: boolean = false;
  public errors: any=[];
  public images: any = [];
  public documents: any = [];
  public tags: any=[];
  public toggleImage: boolean;
  public imageCache: any = '';
  public status: boolean = false;
  public pymeId : string = '';
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
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private _route: ActivatedRoute,
    private _tokenService: Angular2TokenService) {
      this._tokenService.init({apiBase: CONSTANTS.BACK_URL});
  }

  ngOnInit() {
    this.pymeId = this._route.snapshot.paramMap.get('profile_id');
    this.productId = this._route.snapshot.paramMap.get('product_id');
    // this.product = [];
    // this.getProfile();
    this.getProduct();
    this.getCategories();
    this.getMyProducts();
    this.getCustomAndOptions();

    this.stateGroupOptions = this.stateForm.get('stateGroup')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
  }

  private _filterGroup(value: string): Categories[] {

    if (value) {
      return this.options
        .map(c => ({ category: c.category, subcategories: _filter(c.subcategories, value)}))
        .filter(c => c.subcategories.length > 0);
    }

    return this.options;
  }

  add(event: MatChipInputEvent): void {
   let input = event.input;
   let value = event.value;

   // Add our fruit
   if ((value || '').trim()) {
     this.tags.push(value.trim());
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
    let url = API_ROUTES.createRange().replace(":type_profile", "pymes").replace(":profile_id", this.pymeId).replace(":product_id",this.productId);
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

        this.rangesLoading=false;
        // this.parent.toggleView = true;
        // this.parent.getMyProducts();
        this.ranges.push({price: this.price, stock: this.quantity})
        this.price = null;
        this.quantity = null;
        // this.getProduct();

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
    this.rangesLoading=true;
    let object = this;

    if (range.id) {
      let url = API_ROUTES.deletePriceRange().replace(':type_profile', 'pymes').replace(':profile_id', this.pymeId).replace(':product_id', this.productId).replace(':price_range_id', range.id);
      this._tokenService.delete(url).subscribe(
        data => {

          if (index >= 0) {
            this.ranges.splice(index, 1);
            this.rangesLoading=false;
          }
          console.log('products', this.ranges);
          // this.getProduct();
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
    } else {
      if (index >= 0) {
        this.ranges.splice(index, 1);
        this.rangesLoading=false;
      }
    }
  }


  getProduct(){
    this.product = [];
    this.generalLoading=true;
    let object = this;
    let url = API_ROUTES.getProduct().replace(':type_profile', 'pymes').replace(':profile_id', this.pymeId).replace(':product_id', this.productId);
    this._tokenService.get(url).subscribe(
      data =>      {
        this.product = JSON.parse(data['_body']);
        this.product = this.product['data']
        this.product.attributes.subcategory_ids = [];
        this.product.attributes.product_relations = [];
        // if (data['data'].length)
        // this.product = data['data'];
        this.generalLoading=false;
        this.toggleImage = false;

        this.product.attributes['product_relations'] = this.product.attributes['build_products_relations'].map(function(val) {
          return val.id
        })

        this.productRelations = this.product.attributes['build_products_relations'].map(function(val) {
          return {"name": val.name, "id": val.id}
        })


        this.ranges = this.product.attributes['price_ranges'].map(function(val) {
          return {"id": val.id, "price": val.price, "stock": val.stock}
        })

        this.customField = this.product.attributes['custom_fields'].map(function(val) {
          return {"id": val.id, "name": val.name, "value": val.value}
        })


        this.productOption = this.product.attributes.options.map(function(val) {
          return {"id": val.id, "name": val.name, "values": val.values}
        })

        this.subcategories = this.product.attributes.subcategories.map(function(val) {
          return {"id": val.id, "name": val.name}
        })

        this.product.attributes['subcategory_ids'] = this.product.attributes.subcategories.map(function(val) {
          return val.id
        })

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
    this.generalLoading=true;
    this.product.attributes.tags = this.tags;
    this.product.attributes.photos = this.images;
    this.images = [];
    this.product.attributes.documents = this.documents;
    this.documents = [];
    let url = API_ROUTES.updateProduct().replace(':type_profile', "pymes").replace(':profile_id', this.pymeId).replace(':product_id', this.productId);
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

        this.product.attributes['subcategory_ids'] = this.product.attributes.subcategories.map(function(val) {
          return val.id
        })

        this.product.attributes['product_relations'] = this.product.attributes['build_products_relations'].map(function(val) {
          return val.id
        })

        this.generalLoading=false;


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
    let url = API_ROUTES.getPymeProducts().replace(":profile_id", this.pymeId);
    this._tokenService.get(url).subscribe(
      data =>      {
        data = JSON.parse(data['_body']);
        if (data['data'].length)
        this.myProducts = data['data'];

        this.myProducts = this.myProducts.filter(p => p.id != this.productId);

        this.myProducts = this.myProducts.map(function(val) {
          return {"name": val.attributes.name, "id": val.id}
        })

        var product = this.productRelations
        this.myProducts = this.myProducts.map(function(value) {
          var flag = true
          var exit = false;
          product.forEach(function(e) {
            if (!exit) {
              if (e.name == value.name) {
                flag = false;
                exit = true;
              } else {
                flag = true;
                exit = false;
              }
            }
          })
          if (flag) {
            return {"name": value.name, "id": value.id}
          }
        })

        this.myProducts = this.productRelations.filter(Boolean);
        this.generalLoading=false;
        console.log('my products relations', this.myProducts)
        console.log('product relations', this.productRelations)
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

  // getCategories(){
  //   this.generalLoading=true;
  //   let object = this;
  //   let url = API_ROUTES.getCategories();
  //   this._tokenService.get(url).subscribe(
  //     data =>      {
  //       this.options = JSON.parse(data['_body']);
  //       this.options = this.options['data']
  //
  //       // this.options = this.options.map(function(val) {
  //       //   return { category: val.category, subcategories: val.subcategories.map(function(s) {
  //       //     return {name: s.name, id: s.id}
  //       //   }) }
  //       // })
  //       console.log('optionsssssssssssssssssssssss',this.options)
  //       // console.log('categories',this.categories)
  //       this.generalLoading=false;
  //     },
  //     error =>  {
  //       this.generalLoading=false;
  //       if("_body" in error){
  //         error = error._body;
  //         console.log("error: ",error);
  //         if (error.errors && error.errors.full_messages){
  //           error.errors.full_messages.forEach(element => {
  //             object.errors.push(element);
  //           });
  //         }
  //         // this.toastr.error("Error al obtener las Pymes", 'Pyme Error');
  //       }
  //     }
  //   );
  // }


  createCustomField() {
    console.log(this.customFields)
    // this.generalLoading=true;
    this.customLoading = true;
    let object = this;
    let url = API_ROUTES.productCreateCustomFields().replace(':type_profile', "pymes").replace(':profile_id', this.pymeId).replace(':product_id', this.productId);
    let params = {"custom_fields": this.customFields }
    this._tokenService.post(url, params).subscribe(
      data =>      {
        this.customLoading = false;
        this.customField.push({name: this.customFields.name, value: this.customFields.value})
        this.customFields.name = '';
        this.customFields.value = '';
        // this.getProduct();
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

  removeCustomField(custom: any): void {
    let index = this.customField.indexOf(custom);
    this.customLoading = true;
    let object = this;

    if (custom.id) {
      let url = API_ROUTES.productDeleteCustomFields().replace(':type_profile', 'pymes').replace(':profile_id', this.pymeId).replace(':product_id', this.productId).replace(':custom_field_id', custom.id);
      this._tokenService.delete(url).subscribe(
        data =>      {
          if (index >= 0) {
            this.customField.splice(index, 1);
          }
          this.customLoading = false;
          // this.getProduct();
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
    } else {
      if (index >= 0) {
        this.customField.splice(index, 1);
      }
      this.customLoading = false;
    }

  }

  addOption(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

     // Add our fruit
     if ((value || '').trim()) {
      console.log('JSON.stringify(o.values)', this.productOptions)
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
    this.optionsLoading = true;
    let object = this;
    let url = API_ROUTES.productCreateOptions().replace(':type_profile', "pymes").replace(':profile_id', this.pymeId).replace(':product_id', this.productId);
    let params = {"options": this.productOptions }
    this._tokenService.post(url, params).subscribe(
      data =>      {
        this.productOption.push({name: this.productOptions.name, values: this.productOptions.values})
        this.optionsLoading = false;
        this.productOptions.name = '';
        this.productOptions.values = [];
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
          // this.toastr.error("Error al obtener las Pymes", 'Pyme Error');
        }
      }
    );
  }

  deleteOption(option: any): void {
    let index = this.productOption.indexOf(option);
    this.optionsLoading = true;
    let object = this;

    if (option.id) {
      let url = API_ROUTES.productDeleteOptions().replace(':type_profile', 'pymes').replace(':profile_id', this.pymeId).replace(':product_id', this.productId).replace(':option_id', option.id);
      this._tokenService.delete(url).subscribe(
        data =>      {
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
    } else {
      this.optionsLoading = false;
      if (index >= 0) {
        this.productOption.splice(index, 1);
      }
    }

  }

  getBase64(file) {
     var reader = new FileReader();
     reader.readAsDataURL(file);
     reader.onload = function () {
       return reader.result;
     };
     reader.onerror = function (error) {
       console.log('Error: ', error);
     };
   }

  onChange(event: any, input: any) {
    let files = event.target.files;
    let names = [].slice.call(event.target.files);

    this.documentNames = names.map(f => f.name)
    console.log(this.documentNames);
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {

          this.documents.push(e.target.result);

          // this.product.attributes.photos.push(e.target.result);
        }
          reader.readAsDataURL(file);
        }
      }
  }

  back() {
    this.router.navigate([`/admin/pyme/${this.pymeId}`], { queryParams: {tab: "products"} });
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
        // this.product.attributes.photos.push(e.target.result);
      }
        reader.readAsDataURL(file);
      }
    }
    console.log(':::::::::::::::::::',this.product.attributes);
  }

  deleteTempImages(img: any): void {
    let index = this.images.indexOf(img);

     if (index >= 0) {
       this.images.splice(index, 1);
     }
   }

   deleteImages(img: any): void {
     let index = this.product.attributes.photos.indexOf(img);

      if (index >= 0) {
        this.deleteFiles('photo', img.id)
        this.product.attributes.photos.splice(index, 1);
      }
    }

   deleteDocument(document: any): void {
     let index = this.product.attributes.documents.indexOf(document);
     let indexDoc = this.documentNames.indexOf(document);

      if (index >= 0) {
        this.deleteFiles('document', document.id)
        this.product.attributes.documents.splice(index, 1);
      }

      if (indexDoc >= 0) {
        this.documentNames.splice(index, 1);
      }
    }

   getCustomAndOptions() {
     let object = this;
     let url = API_ROUTES.getAPyme().replace(":profile_id", this.pymeId);
     this._tokenService.get(url).subscribe(
       data => {
         data = JSON.parse(data['_body']);
         this.customAndOptions = data['data'];

        this.productCustomFields = this.product.attributes['custom_fields'].map(function(val) {
          return {"id": val.id, "name": val.name, "value": val.value}
        })

        this.productOption = this.product.attributes.options.map(function(val) {
          return {"id": val.id, "name": val.name, "values": val.values}
        })

        this.customFieldIds = this.product.attributes['custom_fields'].map(function(val) {
          return val.id
        })

        this.productOptionIds = this.product.attributes.options.map(function(val) {
          return val.id
        })

        var product = this.productCustomFields;
        var options = this.productOption;

        this.allCustomFields = this.customAndOptions.attributes['custom_fields'].map(function(value) {
          var flag = true
          var exit = false;
          product.forEach(function(e) {
            if (!exit) {
              if (e.name == value.name && e.value == value.value) {
                flag = false;
                exit = true;
              } else {
                flag = true;
                exit = false;
              }
            }
          })
          if (flag) {
            return {"id": value.id, "name": value.name, "value": value.value}
          }
        })

        this.allOptions = this.customAndOptions.attributes.options.map(function(value) {
          var flag = true
          var exit = false;
          options.forEach(function(e) {
            if (!exit) {
              if (e.name == value.name && JSON.stringify(e.values) == JSON.stringify(value.values)) {
                flag = false;
                exit = true;
              } else {
                flag = true;
                exit = false;
              }
            }

          })
          if (flag) {
            return {"id": value.id, "name": value.name, "values": value.values}
          }
        })

        this.allCustomFields = this.allCustomFields.filter(Boolean);
        this.allOptions = this.allOptions.filter(Boolean);

        // console.log('all',this.customAndOptions)
        // console.log('product',this.productOption)
        // console.log('all options',this.allOptions)
        // console.log('all options ids',this.productOptionIds)

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

   removeProduct(product: any): void {
     let index = this.productRelations.indexOf(product);
     let indexP = this.product.attributes['product_relations'].indexOf(product);

      if (index >= 0) {
        this.productRelations.splice(index, 1);
        this.product.attributes['product_relations'].splice(indexP, 1);
      }
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
      }
      this.categoryName = '';
     }

  removeSubcategory(subcategory: any, subcategoryId): void {
    if (this.subcategories.length == 1) {
      Snackbar.show({
        text: "El producto debe tener al menos una categoría",
        showAction: true,
        actionText: '<i class="material-icons">close</i>',
        ppos: "top-right",
        actionTextColor: '#fff'
      });
    } else {
      let index = this.subcategories.indexOf(subcategory);
      let indexId = this.product.attributes['subcategory_ids'].indexOf(subcategoryId);

      if (index >= 0) {
        this.subcategories.splice(index, 1);
      }
    }

  }

  toggleCustomField(custom): void {
    var flag = true;
    var i = 0;
    var obj = this.customField;
    var cf = this.customFieldIds;

    this.customField.forEach(function(c) {
      if (c.name == custom.name && c.value == custom.value) {
        flag = false;
        let index = obj.indexOf(custom);
        let indexId = cf.indexOf(custom.id);
        obj.splice(index, 1)
        cf.splice(indexId, 1)

        console.log(this.customFieldIds)
      }
    })


    if (flag) {
      this.customField.push({name: custom.name, value: custom.value})
      this.customFieldIds.push(custom.id)

      console.log(this.customFieldIds)
    }

    this.customLoading = true;
    let object = this;
    let url = API_ROUTES.productCreateCustomFields().replace(':type_profile', "pymes").replace(':profile_id', this.pymeId).replace(':product_id', this.productId);
    let params = {"custom_fields": {custom_field_ids: this.customFieldIds } }
    console.log(params);
    this._tokenService.post(url, params).subscribe(
      data =>      {
        data = JSON.parse(data['_body']);
        console.log(data)
        this.customLoading = false;
        this.getCustomAndOptions();
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

  toggleOption(option): void {
    var flag = true;
    var obj = this.productOption;
    var po = this.productOptionIds;

    this.productOption.forEach(function(o) {
      if (o.name == option.name && JSON.stringify(o.values) == JSON.stringify(option.values)) {
        flag = false;
        let index = obj.indexOf(option);
        let indexId = po.indexOf(option.id);
        obj.splice(index, 1)
        po.splice(indexId, 1)

      }
    })


    if (flag) {
      this.productOption.push({name: option.name, values: option.values})
      this.productOptionIds.push(option.id)

    }

    this.optionsLoading = true;
    let object = this;
    let url = API_ROUTES.productCreateOptions().replace(':type_profile', "pymes").replace(':profile_id', this.pymeId).replace(':product_id', this.productId);
    let params = {"options": {option_ids: this.productOptionIds } }
    console.log(params);
    this._tokenService.post(url, params).subscribe(
      data =>      {
        data = JSON.parse(data['_body']);
        console.log(data)
        this.optionsLoading = false;
        this.getCustomAndOptions();
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

   pdfUrl(url: string) {
     return `https://drive.google.com/viewerng/viewer?embedded=true&url=http://bigwave-api.herokuapp.com${url}`;
   }

   deleteFiles(fileType: string, fileId: string) {
     let object = this;
     let url = API_ROUTES.deleteFile().replace(':product_id', this.productId).replace(':file_type', fileType).replace(':file_id', fileId);
     let params = {}
     this._tokenService.put(url, params).subscribe(
       data =>      {
         Snackbar.show({
           text: 'Archivo eliminado',
           showAction: true,
           actionText: '<i class="material-icons">close</i>',
           pos: 'top-right',
           actionTextColor: '#fff'
         });
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

   toggleProduct(product: any) {
     var flag = true;
     var obj = this.productRelations;
     var pr = this.product.attributes['product_relations'];

     this.productRelations.forEach(function(p) {
       if (p.name == product.name) {
         flag = false;
         let index = obj.indexOf(product);
         let indexId = pr.indexOf(product.id);
         obj.splice(index, 1)
         pr.splice(indexId, 1)
       }
     })

     if (flag) {
       this.productRelations.push({name: product.name, id: product.id})
       this.product.attributes['product_relations'].push(product.id)
     }
   }
}
