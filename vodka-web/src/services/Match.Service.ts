import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Match, Respuesta } from "../shared/interfaces";
import { BaseService } from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class MatchService extends BaseService<Match>{
  path: string;

  constructor(public http: HttpClient) {
    super(http);
    this.path = '/teams';
  }
}