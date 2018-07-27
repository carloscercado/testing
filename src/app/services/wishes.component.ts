import { Injectable } from '@angular/core';

@Injectable()
export class WishesService {

    private categorys: Categorys[] = [
        {
            id_category: '1',
            name_category: 'Tecnologias'
        },
        {
            id_category: '2',
            name_category: 'Domesticas'
        }
    ];

    private niveles: Niveles[] = [
        {
            nivel: 'Alto',
        },
        {
            nivel: 'Medio',
        },
        {
            nivel: 'Bajo',
        },

    ];
    private wishes: Wish[] = [
        {
          name_wish: 'Iphone 6',
          category_wish: 'Tecnologias',
          img: 'assets/imgs/iphone.jpg',
          description: 'Iphone very useful...',
          presupuesto: '300 USD',
          status_wish: 'Enviado',
          nivel_wish: 'Alto',
          vendedor: 'Alan Walken'
        },
        {
            name_wish: 'Samsung S5',
            category_wish: 'Tecnologias',
            img: 'assets/imgs/samsung.jpg',
            description: 'Samsung very useful... ',
            presupuesto: '200 USD',
            status_wish: 'Enviado',
            nivel_wish: 'Alto',
            vendedor: 'Michellen Sting'
          },
          {
            name_wish: 'Tablet',
            category_wish: 'Tecnologias',
            img: 'assets/imgs/tablet.jpg',
            description: 'Tablet very useful... ',
            presupuesto: '100 USD',
            status_wish: 'Enviado',
            nivel_wish: 'Alto',
            vendedor: 'Richard Verm'
          }
      ];

    constructor() {

        console.log('servicio de deseos funcionando');
    }

    getWishes() {
        return this.wishes;
    }

    getCategorys(){
        return this.categorys;
    }
    getNiveles(){
        return this.niveles;
    }

}

export interface Wish {
    name_wish: string;
    category_wish: string;
    img: string;
    description: string;
    presupuesto: string;
    status_wish: string;
    nivel_wish: string;
    vendedor: string;
}

export interface Categorys{
    id_category: string;
    name_category: string;
}

export interface Niveles{
    nivel: string;
}
