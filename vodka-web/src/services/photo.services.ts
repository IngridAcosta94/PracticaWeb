import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Photo, Respuesta } from "../shared/interfaces";
import { BaseService } from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class PhotoService extends BaseService<Photo>{
  path: string;

  constructor(public http: HttpClient) {
    super(http);
    this.path = '/photos';
  }
}
