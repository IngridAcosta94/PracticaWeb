import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Event, Respuesta } from "../shared/interfaces";

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService<T> {
  url = 'https://api.ligasabatinadefutbol.com.mx/api';
  abstract path:string;
  constructor(public http: HttpClient) {}

  public list(): Observable<Respuesta<T>> {
    return this.http.get<Respuesta<T>>(this.url + this.path);
  }

  public register(model: T) {
    return this.http.post(this.url +this.path, model)
  }

  public detail(model: number) {
   //return this.http.get(`${this.url}${this.path}${model}`);
   return this.http.get(this.url + this.path + "/"+ model)
  }

  //FALTA EL UPDATE
  public edit(idPlayer: number ,model: T) {
    return this.http.put(this.url + this.path + "/" + idPlayer , model)
  }

  public remove(id:number) {

    return this.http.delete(`${this.url}${this.path}${id}`);

  }

  //PREGUNTAR SI REL=FALSE NO AFECTA PARA EL RESTO DE LOS MODELOS
  public get (CantidadElementos: number): Observable<Respuesta<T>> {
    return this.http.get<Respuesta<T>>(this.url + this.path +'?rel=false&limit=' + CantidadElementos );
  }

  public getPagination (LinkPagina: string): Observable<Respuesta<T>> {
    return this.http.get<Respuesta<T>>(LinkPagina);
  }

  public getPaginationPrevious (LinkPagina: string): Observable<Respuesta<T>> {
    return this.http.get<Respuesta<T>>(LinkPagina);
  }

  public search(model: number) {
    return this.http.get(`${this.url}${this.path}${model}`);
   }

//https://api.ligasabatinadefutbol.com.mx/api/teams?rel=false&limit=25

}
