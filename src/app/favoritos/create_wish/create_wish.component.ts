import { Component, OnInit } from '@angular/core';
import { WishesService, Categorys, Niveles } from './../../services/wishes.component';

@Component({
  selector: 'app-createwish',
  templateUrl: './create_wish.component.html',
  styleUrls: ['./create_wish.component.scss']
})
export class CreatewishComponent implements OnInit {

  categorys: Categorys[] = [];
  niveles: Niveles[] = [];

  constructor(private _wishesService: WishesService) { }

  ngOnInit() {

    this.categorys = this._wishesService.getCategorys();
    this.niveles = this._wishesService.getNiveles();
  }

}
