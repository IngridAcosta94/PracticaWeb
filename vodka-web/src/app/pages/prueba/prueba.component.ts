import { Component, OnInit } from '@angular/core';

import { Event , matchEvents } from 'src/shared/interfaces';
import { Router } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.scss']
})
export class PruebaComponent implements OnInit {
  
  events: Event[];
  matchEvents : matchEvents[];
  error:boolean;
  constructor(/*public service: testService*/ private router: Router) {
    this.error = false;
    this.events = [];
    this.matchEvents = [];
  }

  ngOnInit() {
    
    /*this.error = true;
    this.service.getPrueba().subscribe(events =>{
      this.events = events.data;
      console.log(this.events);
    });

    this.service.matchevent().subscribe(matchEvents =>{
      this.matchEvents = matchEvents.data;
      console.log(this.matchEvents);
    });*/


//ESTE NI FUNCIONA
    /*this.service.getPrueba().subscribe(
      {next : (eventsFromApi : Event[]) => {
        this.events = eventsFromApi
        console.log(this.events)
      },
      error: err => {
        console.log(err.error.msg);
      }
      }
    ); */
   
    
  }

     
 

}
