import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/prueba', title: 'Prueba',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/icons', title: 'Jornadas',  icon:'ni-planet text-blue', class: '' },
    { path: '/maps', title: 'Estadísticas',  icon:'ni-pin-3 text-orange', class: '' },
    { path: '/user-profile', title: 'Jugadores',  icon:'ni-single-02 text-yellow', class: '' },
    { path: '/tables', title: 'Eventos',  icon:'ni-bullet-list-67 text-red', class: '' },
    { path: '/index', title: 'Equipos',  icon:'ni-bullet-list-67 text-red', class: '' },
    { path: '/indexSeason', title: 'Torneos',  icon:'ni-bullet-list-67 text-red', class: '' },
    { path: '/indexPlayer', title: 'Jugadores',  icon:'ni-bullet-list-67 text-red', class: '' },
    { path: '/createMatchDays', title: 'Jornadas',  icon:'ni-bullet-list-67 text-red', class: '' },
   // { path: '/createSeason', title: 'Torneos',  icon:'ni-bullet-list-67 text-red', class: '' },

    
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
}
