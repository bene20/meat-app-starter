import { Component, OnInit } from '@angular/core';
import { Restaurant } from './restaurant/restaurant.model';
import { RestaurantsService } from './restaurants.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Observable, from } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged, tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'mt-restaurants',
  templateUrl: './restaurants.component.html',
  animations: [
    trigger('toggleSearch', [
      state('hidden', style({'opacity': 0, 'max-height': '0px'})),
      state('visible', style({'opacity': 1, 'max-height': '70px', 'margin-top': '20px'})),
      transition('* => *', animate('250ms 0s ease-in-out'))
    ])
  ]
})
export class RestaurantsComponent implements OnInit {

  searchBarState: string = 'hidden';
  restaurants: Restaurant[];

  searchForm: FormGroup;
  searchControl: FormControl;

  constructor(private restaurantsService: RestaurantsService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.searchControl = this.fb.control('');

    this.searchForm = this.fb.group({
      searchControl: this.searchControl
    });

    this.searchControl
        .valueChanges
        .pipe(
          debounceTime(500), // Só passo para a próxima execução se a diferença de tempo entre as execuções for superior a 500ms
          distinctUntilChanged(), // Só passo para a próima execução se a pesquisa atual for diferente da anterior
          switchMap(searchTerm => this.restaurantsService
                                      .restaurants(searchTerm)
                                      .pipe(catchError(error => from([])))) // Meu backend deu erro e nesse caso quero enviar
                                                                            // "nada" (como se a resposta do backend fosse
                                                                            // 'vazio') para o meu subscribe
          )
        .subscribe(restaurants => this.restaurants = restaurants);

    this.restaurantsService.restaurants()
                           .subscribe( restaurants => this.restaurants = restaurants);
  }

  toggleSearch() {
    this.searchBarState = this.searchBarState === 'hidden' ? 'visible' : 'hidden';
  }
}
