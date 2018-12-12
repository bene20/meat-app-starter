import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from './menu-item.model';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'mt-menu-item',
  templateUrl: './menu-item.component.html',
  animations: [
    trigger('menuItemAppeared', [
      state('ready', style({opacity: 1})),
      transition('void => ready', [
        style({opacity: 0, transform: 'translateY(-20px)'}),
        animate('300ms 0s ease-in')
      ])
    ])
  ]
})
export class MenuItemComponent implements OnInit {

  menuItemState: string = 'ready';

  @Input() menuItem: MenuItem;

  @Output() add = new EventEmitter(); //Criando um evento para o meu componente (tipo um onClick, onKeyUp etc.).
                                      //O nome do evento é o nome desta propriedade, isto é, "add".
                                      //No componente, eu devo dizer qual é o método que será chamado quando
                                      //o meu evento for emitido. Nesse caso eu chamarei o método emmitAddEvent abaixo (veja
                                      //o trecho '(click)="emmitAddEvent()"' no código do componente).

  constructor() { }

  ngOnInit() {
  }

  emmitAddEvent(){
    this.add.emit(this.menuItem);
  }

}
