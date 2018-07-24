import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API_ROUTES, CONSTANTS } from '../app.constants';
import { Angular2TokenService } from 'angular2-token';

declare var Snackbar: any;
@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.css']
})
export class DetailProductComponent implements OnInit {
  public profileType: string;
  public profileId: string;
  public productId: string;
  public loading = false;
  product : any = {}
  constructor(private _route: ActivatedRoute, private _tokenService: Angular2TokenService) { 
    this._tokenService.init({apiBase: CONSTANTS.BACK_URL});
    this.profileType = this._route.snapshot.paramMap.get('type_profile');
    this.profileId = this._route.snapshot.paramMap.get('profile_id');
    this.productId = this._route.snapshot.paramMap.get('product_id');
  }

  ngOnInit() {
    this.getProduct();
  }

  getProduct(){
    this.product = {};
    this.loading=true;
    let object = this;
    let url = API_ROUTES.getProduct().replace(':type_profile', this.profileType).replace(':profile_id', this.profileId).replace(':product_id', this.productId);
    this._tokenService.get(url).subscribe(
      data =>      {
        this.product = JSON.parse(data['_body']);
        this.product = this.product['data']
        // if (data['data'].length)
        // this.product = data['data'];
        this.loading=false;
        // this.ranges = this.product.attributes['price_ranges'].map(function(val) {
        //   return {"id": val.id, "price": val.price, "stock": val.stock}
        // })

        // this.customField = this.product.attributes['custom_fields'].map(function(val) {
        //   return {"id": val.id, "name": val.name, "value": val.value}
        // })

        // this.productOption = this.product.attributes.options.map(function(val) {
        //   return {"id": val.id, "name": val.name, "values": val.values}
        // })


        // this.tags = this.product.attributes.tags

        // console.log('products', this.ranges);
        // console.log('taaaaaaaags', this.tags);
        //console.log(this.product)
      },
      error =>  {
        this.loading=false;
        if('_body' in error){
          error = error._body;
          if (error.errors && error.errors.full_messages){
            error.errors.full_messages.forEach(element => {
              //object.errors.push(element);
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

}
