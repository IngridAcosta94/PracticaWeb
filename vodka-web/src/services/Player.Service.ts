import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Player, Respuesta, PlayerArray } from "../shared/interfaces";
import { BaseService } from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class PlayerService extends BaseService<Player>{
  path: string;

  url = 'https://api.ligasabatinadefutbol.com.mx/api';

  constructor(public http: HttpClient) {
    super(http);
    this.path = '/players';

  }

  public registerPlayer(model: Player[]) {
    return this.http.post("https://api.ligasabatinadefutbol.com.mx/api/players/bulk", model)
  }

  public ActivePlayers(model: Player[]) {
    return this.http.post("https://api.ligasabatinadefutbol.com.mx/api/players/bulk", model)
  }

/* api/players/free
en el body {players: number[]} */

public releasePlayer(playersId: PlayerArray ) {
  return this.http.put("https://api.ligasabatinadefutbol.com.mx/api/players/free", playersId)
}
  


}