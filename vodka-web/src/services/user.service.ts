import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Event, Respuesta, User } from "../shared/interfaces";
import { BaseService } from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User>{
  path: string;

  constructor(public http: HttpClient) {
    super(http);
    this.path = '/users';
  }

  public login(model: User) {
    return this.http.post("http://api.ligasabatinadefutbol.com.mx/api/login", model)
  }

  
}


