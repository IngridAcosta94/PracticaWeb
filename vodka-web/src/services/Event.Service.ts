import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Event, Respuesta } from "../shared/interfaces";
import { BaseService } from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseService<Event>{
  path: string;

  constructor(public http: HttpClient) {
    super(http);
    this.path = '/events';
  }
}
