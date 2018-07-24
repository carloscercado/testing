import { Component, OnInit, Inject } from '@angular/core';
import { API_ROUTES } from '../app.constants';
import { Angular2TokenService } from 'angular2-token';
import { CONSTANTS } from '../app.constants';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { AlertComponent } from '../alert/alert.component';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { element } from 'protractor';

declare var $: any;
declare var Snackbar: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loadingPymes: boolean = false;
  loadingPymesSlick: boolean = false;
  loadingSellers: boolean = false;
  loadingSellersSlick: boolean = false;
  loadingIndependents: boolean = false;
  loadingIndependentsSlick: boolean = false;
  loadingCategories: boolean = false;
  loadingCategorySlick: boolean = false;
  loadingProducts: boolean = false;
  loadingProductsSlick: boolean = false;
  pymes: any = [];
  sellers: any = [];
  independents: any = [];
  categories: any = [];
  products: any = [];
  errors: any = [];
  profilesFollowed: any = [];

  constructor(private router: Router, public _tokenService: Angular2TokenService, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) private data: any) {
    this._tokenService.init({ apiBase: CONSTANTS.BACK_URL });
    this.pymes = [];
    this.independents = [];
    this.sellers = [];
  }

  ngOnInit() {
    this.getPymes();
    this.getIndependents();
    this.getCategories();
    this.getSellers();
    this.getLatestProducts();

    var object = this;

  }

  ngDoCheck() {
    if (!this.loadingCategories && !this.loadingCategorySlick) {
      this.loadingCategorySlick = true;
      this.renderCarousel('carousel-category');
    }
    if (!this.loadingIndependents && !this.loadingIndependentsSlick) {
      this.loadingIndependentsSlick = true;
      this.renderCarousel('carousel-independents');
    }
    if (!this.loadingPymes && !this.loadingPymesSlick) {
      this.loadingPymesSlick = true;
      this.renderCarousel('carousel-pymes');
    }
    if (!this.loadingSellers && !this.loadingSellersSlick) {
      this.loadingSellersSlick = true;
      this.renderCarousel('carousel-sellers');
    }
    if (!this.loadingProducts && !this.loadingProductsSlick) {
      this.loadingProductsSlick = true;
      this.renderCarousel('carousel-products');
    }

  }

  renderCarousel(id) {
    setTimeout(() => {
      $('#' + id).slick({
        responsive: [
          {
            breakpoint: 1125,
            settings: {
              arrows: false,
              slidesToShow: 4,
            }
          },
          {
            breakpoint: 768,
            settings: {
              arrows: false,
              slidesToShow: 3,
            }
          },
          {
            breakpoint: 600,
            settings: {
              arrows: false,
              slidesToShow: 2,
            }
          },
          {
            breakpoint: 385,
            settings: {
              arrows: false,
              slidesToShow: 1,
            }
          },

        ]
      });
    }, 400);
  }

  /**
   * acciones de acuerdo al estatus del usuario dentro de la aplicación
   * @param msg a mostrar de acuerdo a la accion a realizar cuando se requiere autenticacion
   * @param act verbo asociado a la accion a realizar puede ser crear, seguir, deseo
   * @param i autenticado? es la posicion del array en la cual se encuentra el profile al cual se le realiza la accion : null
   * @param item profile al cual se le realiza la accion
   * @param link landing page
   */
  openLoginDialog(msg?, act?, i?, item?, link?) {
    //console.log(link)
    if (!this._tokenService.userSignedIn()) {
      let note = "Para " + msg + ", debes iniciar sesión";
      const dialogRef = this.dialog.open(LoginComponent, {
        width: '50%',
        data: { message: note, link: link },
      });
      dialogRef.afterClosed().subscribe(result => {

        if (this._tokenService.userSignedIn()) {
          this.getProfilesFollowed("pyme"); this.getProfilesFollowed("independent"); this.getProfilesFollowed("seller");
          this.getMyWish();
        }

      });

    } else {

      if (act == "seguir") {

        if (!item.attributes.follow) {
          this.followProfile(i, item)
        } else {
          const dialogRef = this.dialog.open(AlertComponent, {
            data: { title: JSON.parse(localStorage.getItem('user')).name, message: "Dejaras de seguir a " + item.attributes.name, NO: "Cancelar", YES: "Aceptar" },
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.unfollowProfile(i, item)
            }
          });
        }

      } else {

        if (item.attributes.wish == null) {
          this.createWishes(item, i)
        } else {
          const dialogRef = this.dialog.open(AlertComponent, {
            data: { title: JSON.parse(localStorage.getItem('user')).name, message: "Eliminaras de la lista de deseos a" + item.attributes.name, NO: "Cancelar", YES: "Aceptar" },
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              //console.log("lo has Eliminado de la lista")
              // this.deleteWish(item)
              this.deleteWish(item, i)
            }
          });
        }

      }

    }
  }

  getPymes() {
    this.loadingPymes = true;
    let object = this;
    let url = API_ROUTES.getPymes();
    this._tokenService.get(url).subscribe(
      data => {
        data = JSON.parse(data['_body']);
        if (data['data'].length)
          this.pymes = data['data'].map((element) => ({
            id: element.id,
            attributes: {
              type_profile: element.attributes.type_profile,
              photo: element.attributes.photo,
              name: element.attributes.name,
              follow: false
            }
          }));

        if (this._tokenService.userSignedIn())
          this.getProfilesFollowed("pyme")

        this.loadingPymes = false;
      },
      error => {
        this.loadingPymes = false;
        if ("_body" in error) {
          error = error._body;
          if (error.errors && error.errors.full_messages) {
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

  getIndependents() {
    this.loadingIndependents = true;
    let object = this;
    let url = API_ROUTES.getIndependents();
    this._tokenService.get(url).subscribe(
      data => {
        data = JSON.parse(data['_body']);
        //console.log(data)
        if (data['data'].length)
          this.independents = data['data'].map((element) => ({
            id: element.id,
            attributes: {
              type_profile: element.attributes.type_profile,
              photo: element.attributes.photo,
              name: element.attributes.name,
              follow: false
            }
          }));

        if (this._tokenService.userSignedIn())
          this.getProfilesFollowed("independent")

        this.loadingIndependents = false;
      },
      error => {
        this.loadingIndependents = false;
        if ("_body" in error) {
          error = error._body;
          if (error.errors && error.errors.full_messages) {
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

  getSellers() {
    this.loadingSellers = true;
    let object = this;
    let url = API_ROUTES.getSellers();
    this._tokenService.get(url).subscribe(
      data => {
        data = JSON.parse(data['_body']);
        if (data['data'].length)
          this.sellers = data['data'].map((element) => ({
            id: element.id,
            attributes: {
              type_profile: element.attributes.type_profile,
              photo: element.attributes.photo,
              name: element.attributes.name,
              follow: false
            }
          }));

        if (this._tokenService.userSignedIn())
          this.getProfilesFollowed("seller")

        this.loadingSellers = false;
      },
      error => {
        this.loadingSellers = false;
        if ("_body" in error) {
          error = error._body;
          if (error.errors && error.errors.full_messages) {
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

  followProfile(i, item) {

    let url = API_ROUTES.followProfile().replace(":type_profile", item.attributes.type_profile).replace(":profile_id", item.id);
    this._tokenService.get(url).subscribe(data => {
      //console.log(data)
      data = JSON.parse(data['_body']);
      var name = item.attributes.name
      //item.attributes.follow = true;
      this.updateFollowUnfollowArray(item, i, true)
      Snackbar.show({
        text: "Ahora sigues a " + name,
        showAction: true,
        actionText: '<i class="material-icons">close</i>',
        ppos: "top-right",
        actionTextColor: '#fff'
      });

    }, error => {

    }
    );
  }

  updateFollowUnfollowArray(item, i, action) {
    switch (item.attributes.type_profile.toLowerCase()) {
      case "pyme":
        this.pymes[i].attributes.follow = action;
        break;
      case "independent":
        this.independents[i].attributes.follow = action;
        break;
      case "seller":
        this.sellers[i].attributes.follow = action;
        break;
      default:
        break;
    }
  }

  getProfilesFollowed(type_profile) {
    let array = []
    switch (type_profile.toLowerCase()) {
      case "pyme":
        array = this.pymes
        break;
      case "independent":
        array = this.independents
        break;
      case "seller":
        array = this.sellers
        break;
      default:
        break;
    }
    let url = API_ROUTES.getFollowing().replace(":type_profile", type_profile);
    this._tokenService.get(url).subscribe(data => {
      data = JSON.parse(data['_body']);
      let resul = data['data']
      for (let j = 0; j < array.length; j++) {
        for (let i = 0; i < resul.length; i++) {
          if (array[j].id == resul[i].id) {
            array[j].attributes.follow = true
            this.updateFollowUnfollowArray(array[j], j, true)
          }
        }
      }
    }, error => {
    });
  }

  unfollowProfile(i, item) {
    let url = API_ROUTES.unfollowProfile().replace(":type_profile", item.attributes.type_profile).replace(":profile_id", item.id);
    let params = { "unfollow": { "profile_id": item.id } }
    this._tokenService.post(url, params).subscribe(data => {
      data = JSON.parse(data['_body']);
      var name = item.attributes.name
      if (data != null) {
        //  item.attributes.follow = false;
        this.updateFollowUnfollowArray(item, i, false)
        Snackbar.show({
          text: "has dejado de seguir a " + name,
          showAction: true,
          actionText: '<i class="material-icons">close</i>',
          ppos: "top-right",
          actionTextColor: '#fff'
        });
      }
    }, error => {
    });
  }

  getCategories() {
    this.loadingCategories = true;
    let object = this;
    let url = API_ROUTES.getCategories();
    this._tokenService.get(url).subscribe(
      data => {
        data = JSON.parse(data['_body']);
        //console.log(data);
        if (data['data'].length)
          this.categories = data['data'];
        this.categories = this.categories.map(function (op) {
          return { "id": op.id, "name": op.attributes.name, "subcategories": op.attributes.subcategories }
        })
        //console.log('categories',this.categories)
        this.loadingCategories = false;
      },
      error => {
        this.loadingCategories = false;
        if ("_body" in error) {
          error = error._body;
          console.log("error: ", error);
          if (error.errors && error.errors.full_messages) {
            error.errors.full_messages.forEach(element => {
              object.errors.push(element);
            });
          }
          // this.toastr.error("Error al obtener las Pymes", 'Pyme Error');
        }
      }
    );
  }

  /**
   * Los productos mas actuales, aun no existe una ruta en la API que me permita hacer esto
   */
  getLatestProducts() {
    this.products = []
    this.loadingProducts = true;
    let object = this;
    let url = API_ROUTES.getPymeProducts().replace(":profile_id", "1");
    this._tokenService.get(url).subscribe(
      data => {
        data = JSON.parse(data['_body']);
        if (data['data'].length)
          this.products = data['data'].map((element) => ({
            id: element.id,
            attributes: {
              price: element.attributes.price,
              name: element.attributes.name,
              wish: null
            }
          }));
        //console.log("Esta son los proucts", this.products)
        if (this._tokenService.userSignedIn())
          this.getMyWish()
        this.loadingProducts = false;
      },
      error => {
        this.loadingProducts = false;
        if ("_body" in error) {
          error = error._body;
          if (error.errors && error.errors.full_messages) {
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

  detailProduct(product) {
    this.router.navigate(["product", "pyme", "1", product.id])
  }

  createWishes(product, i) {
    let url = API_ROUTES.createWishes();
    //"name": "test", "description": "example", "budget": "1200",
    let params = { "wish": { "wisheable_id": product.id, "wisheable_type": "product" } }
    this._tokenService.post(url, params).subscribe(data => {
      data = JSON.parse(data['_body']);
      //console.log("response de deseo", data)
      if (data != null) {
        this.products[i].attributes.wish = data["data"].id;
        Snackbar.show({
          text: "Agregado a la lista de deseos",
          showAction: true,
          actionText: '<i class="material-icons">close</i>',
          ppos: "top-right",
          actionTextColor: '#fff'
        });
      }
    }, error => {
    });
  }

  deleteWish(wish, i) {
    let url = API_ROUTES.deleteWishes().replace(':wish_id', wish.attributes.wish);
    this._tokenService.delete(url).subscribe(data => {
      //console.log("eliminado de deseo", data)
      data = JSON.parse(data['_body']);
      if (data['data'] != null) {
        this.products[i].attributes.wish = null;
        Snackbar.show({
          text: "Eliminado de la lista de deseos",
          showAction: true,
          actionText: '<i class="material-icons">close</i>',
          ppos: "top-right",
          actionTextColor: '#fff'
        });
      }
    }, error => {
      console.log(error)
    });
  }

  getMyWish() {
    let wishes = []
    let url = API_ROUTES.myWishes();
    this._tokenService.get(url).subscribe(data => {
      data = JSON.parse(data['_body']);
      if (data['data'].length) {
        wishes = data['data'];
        //console.log("wishes", wishes)
        for (let j = 0; j < this.products.length; j++) {
          for (let i = 0; i < wishes.length; i++) {
            if (wishes[i].attributes.wisheable.id == this.products[j].id) {
              this.products[j].attributes.wish = wishes[i].id
            }
          }
        }
      }
    }, error => {

    });
  }
}


