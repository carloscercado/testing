import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { API_ROUTES } from '../../app.constants';
import { CONSTANTS } from '../../app.constants';
import { ProductsPymeComponent } from './products/products.component';
import { ActivatedRoute } from '@angular/router';
declare var Snackbar: any;

@Component({
  selector: 'admin-pymes',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminPymesComponent implements OnInit {
  public loading: boolean = false;
  public generalLoading: boolean = false;
  public errors: any=[];
  public option: string = 'information';
  public pymeId: string;
  public pyme: any = {
    name: "",
    email: "",
    description: "",
    vission: "",
    mission: "",
    title: ""
  };

  constructor(
    private _route: ActivatedRoute,
   private _tokenService: Angular2TokenService) {
    this._tokenService.init({apiBase: CONSTANTS.BACK_URL});
    this.pymeId = this._route.snapshot.paramMap.get('pyme_id');
    this._route.queryParams.subscribe(params => {
      if ('tab' in params)
        if (params['tab'] == 'products') {
          this.option = 'products';
        }

      console.log(params)
    });
  }

  ngOnInit() {
    this.getPyme();
  }

  getPyme() {
    this.pyme={};
    this.loading = true;
    this.generalLoading=true;
    let object = this;
    let url = API_ROUTES.getAPyme().replace(":profile_id", this.pymeId);
    this._tokenService.get(url).subscribe(
      data => {
        data = JSON.parse(data['_body']);
        this.pyme = data['data'];
        this.generalLoading = false;
        console.log(this.pyme);
        this.loading = false;
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

  updatePyme(){
    var object = this;
    object.errors=[];
    this.loading=true;
    // this.userService.user = this.user;
    let url = API_ROUTES.updatePyme().replace(":pyme_id", this.pymeId);
    let params = {"pyme": this.pyme.attributes}
    this._tokenService.put(url, params).subscribe(
      data =>      {
        data = JSON.parse(data['_body']);
        console.log("data:: ", data);
        this.pyme = data['data'];
        // Object.assign({}, this.pyme, data['data']);
        Snackbar.show({
          text: "Perfil Actualizado Exitosamente",
          showAction: true,
          actionText: '<i class="material-icons">close</i>',
          pos: "top-right",
          actionTextColor: '#fff'
        });
        this.loading=false;
      },
      error => {
        this.loading=false;
        if("_body" in error){
          error=JSON.parse(error._body);
          console.log(error);
          console.log(object);
          if (error.errors.full_messages){
            error.errors.full_messages.forEach(element => {
              Snackbar.show({
                text: `${element}`,
                showAction: true,
                actionText: '<i class="material-icons">close</i>',
                ppos: "top-right",
                actionTextColor: '#fff'
              });
            });
          }else {
            error.errors.forEach(element => {
              Snackbar.show({
                text: `${element}`,
                showAction: true,
                actionText: '<i class="material-icons">close</i>',
                ppos: "top-right",
                actionTextColor: '#fff'
              });
            });
          }
        }
      });
  }
}
