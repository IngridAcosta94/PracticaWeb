import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MatchDay, Respuesta } from "../shared/interfaces";
import { BaseService } from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class MatchDayService extends BaseService<MatchDay>{
  path: string;

  constructor(public http: HttpClient) {
    super(http);
    this.path = '/teams';
  }
}