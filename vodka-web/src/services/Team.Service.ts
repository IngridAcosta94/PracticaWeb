import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Team, Respuesta } from "../shared/interfaces";
import { BaseService } from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class TeamService extends BaseService<Team>{
  path: string;

  constructor(public http: HttpClient) {
    super(http);
    this.path = '/teams';
  }
}

