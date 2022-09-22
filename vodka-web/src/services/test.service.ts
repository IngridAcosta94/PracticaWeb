import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Event, matchEvents, Respuesta } from "../shared/interfaces";

@Injectable({
  providedIn: 'root'
})
export class testService {
  url = 'https://api.ligasabatinadefutbol.com.mx/api';
  constructor(
    public http: HttpClient
  ) {

  }


  /*getPrueba() : Observable<Event[]> {
    return this.http.get<Event[]>(this.url + '/events')
  }*/

  public getPrueba(): Observable<Respuesta<Event>> {
    return this.http.get<Respuesta<Event>>(this.url + '/events');

}


public matchevent() : Observable<Respuesta<matchEvents>>{

    return this.http.get<Respuesta<matchEvents>>(this.url + '/match-events');
}



}
