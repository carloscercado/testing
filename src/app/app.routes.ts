import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Error404Component } from './error-404/error-404.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ProfileComponent } from './profile/profile.component';
import { NavbarSearchComponent } from './search/navbar-search.component';
import { SearchPageComponent } from './search/search-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
// import {CreatePymeComponent} from './pymes/create.component';
import { AdminPymesComponent } from './pymes/admin/admin.component';
import { AdminIndependentsComponent } from './independents/admin/admin.component';
import { AdminSellersComponent } from './sellers/admin/admin.component';

import { ShowPymesProductsComponent } from './pymes/admin/products/show.component';
import { ShowIndependentsProductsComponent } from './independents/admin/products/show.component';
import { ShowSellersProductsComponent } from './sellers/admin/products/show.component';
import { DetailComponent } from './detail/detail.component';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { FavoritosComponent } from './favoritos/favoritos.component';
import { PageComponent } from './page/page.component';
import { CreatewishComponent } from './favoritos/create_wish/create_wish.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    data: { preload: false }
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: { preload: false }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { preload: false }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { preload: false }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: { preload: false }
  },
  {
    path: 'searchs',
    component: SearchPageComponent,
    data: { preload: false }
  },
  {
    path: 'admin/pyme/:pyme_id',
    component: AdminPymesComponent,
    data: { preload: false }
  },
  {
    path: 'pymes/show/product/:profile_id/:product_id',
    component: ShowPymesProductsComponent,
    data: { preload: false }
  },
  {
    path: 'independents/show/product/:profile_id/:product_id',
    component: ShowIndependentsProductsComponent,
    data: { preload: false }
  },
  {
    path: 'sellers/show/product/:profile_id/:product_id',
    component: ShowSellersProductsComponent,
    data: { preload: false }
  },
  {
    path: 'admin/independent/:independent_id',
    component: AdminIndependentsComponent,
    data: { preload: false }
  },
  {
    path: 'admin/seller/:seller_id',
    component: AdminSellersComponent,
    data: { preload: false }
  },
  {
    path: 'detail/:type_profile/:profile_id',
    component: DetailComponent,
    data: { preload: false }
  },
  {
    path: 'product/:type_profile/:profile_id/:product_id',
    component: DetailProductComponent,
    data: { preload: false }
  },
  {
    path: 'page/:type_profile',
    component: PageComponent,
    data: { preload: false }
  },
  {
    path: 'favoritos/:type_profile/:profile_id',
    component: DetailComponent,
    data: { preload: false }
  },
  {
    path: 'favoritos/create_wish/:type_profile/:profile_id',
    component: CreatewishComponent,
    data: { preload: false }
  },
  {
    path: '404',
    component: Error404Component,
    data: { preload: false }
  },
  {
      path: '**',
      redirectTo: '404'
  }
];
