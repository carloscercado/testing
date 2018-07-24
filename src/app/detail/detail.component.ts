import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API_ROUTES, CONSTANTS } from '../app.constants';
import { Angular2TokenService } from 'angular2-token';

declare var Snackbar: any;
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  
  public profileType: string;
  public profileId: string;
  public profile: any = {}
  public loading = false
  constructor(private _route: ActivatedRoute, private _tokenService: Angular2TokenService) {
    this._tokenService.init({apiBase: CONSTANTS.BACK_URL});
    this.profileType = this._route.snapshot.paramMap.get('type_profile');
    this.profileId = this._route.snapshot.paramMap.get('profile_id');
    //console.log(this.profileType + " " + this.profileId)
   }

  ngOnInit() {
    
    switch (this.profileType.toLocaleLowerCase()) {
      case "pyme":
          this.getPyme()
        break;
      case "independent":
          this.getIndependent()
      break;
      case "seller":
          this.getSeller()
      break;
      default:
          this.loading = true;
        break;
    }
    
  }

  getPyme() {
    this.profile={};
    this.loading = true;
    let url = API_ROUTES.getAPyme().replace(":profile_id", this.profileId);
    this._tokenService.get(url).subscribe(
      data => {
        data = JSON.parse(data['_body']);
        this.profile = data['data'];
        this.loading = false;
      },
      error =>  {
        
        if("_body" in error){
          error = error._body;
          if (error.errors && error.errors.full_messages){
            error.errors.full_messages.forEach(element => {
             
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

  getSeller() {
    this.profile={};
    this.loading = true
    let object = this;
    let url = API_ROUTES.getASeller().replace(":profile_id", this.profileId);
    this._tokenService.get(url).subscribe(
      data => {
        data = JSON.parse(data['_body']);
        this.profile = data['data'];
        this.loading = false;
      },
      error =>  {
        if("_body" in error){
          error = error._body;
          if (error.errors && error.errors.full_messages){
            error.errors.full_messages.forEach(element => {
              //object.errors.push(element);
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

  getIndependent() {
    this.profile={};
    this.loading = true;
    let object = this;
    let url = API_ROUTES.getAIndependent().replace(":profile_id", this.profileId);
    this._tokenService.get(url).subscribe(
      data => {
        data = JSON.parse(data['_body']);
        this.profile = data['data'];
        this.loading = false;
      },
      error =>  {
  
        if("_body" in error){
          error = error._body;
          if (error.errors && error.errors.full_messages){
            error.errors.full_messages.forEach(element => {
              //object.errors.push(element);
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