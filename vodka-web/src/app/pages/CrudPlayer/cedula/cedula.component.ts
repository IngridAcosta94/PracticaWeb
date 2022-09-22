import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogState } from "@angular/material/dialog";
import { Season, Pagination, Team, Player, Position, PlayerArray } from "src/shared/interfaces";
import { SeasonService } from "src/services/season.service";
import { TeamService } from "src/services/team.service";
import { PlayerService } from "src/services/player.service";
import { PositionService } from "src/services/position.service";
import { Router } from "@angular/router";

import { FormGroup, FormControl, FormArray, FormBuilder } from "@angular/forms";
import { ModalseasonComponent } from "src/app/Plantillas/modalseason/modalseason.component";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-cedula',
  templateUrl: './cedula.component.html',
  styleUrls: ['./cedula.component.scss']
})
export class CedulaComponent implements OnInit {

  player1: PlayerArray;
  today: Date = new Date();
  pipe = new DatePipe('en-US');
  itemsPlayer: [];
  player: Player;
  players: Player[];
  playerPost: Player[];
  playersActive: number[];
  positions: Position[];
  error: boolean;
  playersOriginal: Player[];
  limit: number;
  pagination: Pagination;
  isLoginDialogOpen: boolean = false;
  playersSelected: Player[];
  teamsId: number[];
  form: FormGroup;
  status: boolean;


  constructor(
    private router: Router,
    private service: SeasonService,
    public dialog: MatDialog,
    public teamService: TeamService,
    public snakbar: MatSnackBar,
    public servicePlayer: PlayerService,
    public servicePosition: PositionService,



  ) {


    this.status = true;
    this.player1 = { players: [0] };
    this.itemsPlayer = [];
    this.playersOriginal = [];
    this.error = false;
    this.player;
    this.players = [];
    this.playersActive = [0];
    this.positions;
    this.teamsId = [];
    this.pagination;
    this.limit = 25;
    this.playersSelected = [];
    this.playerPost = []
    this.restore();
    this.form = new FormGroup({
      first_name: new FormControl(""),
    });



  }

  ngOnInit(): void {
    this.load();
  }



  load() {
    debugger
    this.servicePlayer.get(this.limit).subscribe((players) => {
      this.players = players.data;
      // this.players = players.data.filter(
      //   (player) => this.playersSelected.findIndex((t) => t.id == player.id) == -1
      // );
      this.playersOriginal = players.data;
    });


    //Cualquier cambio que suceda se vea reflejado
    this.form.valueChanges.subscribe(valores => {
      if (!valores) return;
      this.players = this.playersOriginal;
      this.findPlayers(valores);

      // console.log(valores);
    });

  }


  findPlayers(valores: any) {
    debugger
    if (valores.first_name) {
      this.players = this.players.filter(
        (t) => t.first_name.indexOf(valores.first_name) !== -1
      );
    }
  }


  drop($event: CdkDragDrop<Player[]>) {
    debugger
    if ($event.previousContainer === $event.container) {
      moveItemInArray(
        $event.container.data,
        $event.previousIndex,
        $event.currentIndex
      );
    } else
      transferArrayItem(
        $event.previousContainer.data, //De donde se recogio
        $event.container.data, //En donde se dejo
        $event.previousIndex,
        $event.currentIndex
      )

    //  if(this.playersSelected.length >3){

    //   this.status = false;
    //   console.log("mayor a 3"+this.status);


    //  }
    //  if(this.playersSelected.length <=3){

    //   this.status = true;
    //   console.log("menor a 3"+this.status);


    //  }

    console.log(this.playersSelected.length)

  }


  public noReturnPredicate(drag: CdkDrag<any>, drop: CdkDropList<any>) {

    // if(typeof this.status=="undefined")
    // {
    //   this.status = true;
    //   console.log("entro");
    // }
    if (
      drop.data && drop.data.length > 24) {
      // this.status = false;
      return false;
    }
    return true;

  }

  AddPlayersActive() {

    debugger
    this.playersSelected.forEach(element => {

      element.status = 'Active';

      this.servicePlayer.edit(element.id, element).subscribe((resp: Player) => {

        console.log(resp)
      });

    });


  }


  deleteItem(id: number) {
    debugger
    this.playersSelected = this.playersSelected.filter((i) => i.id !== id);

    // this.AddLocalStorage();
    this.load();

  }

  search(name: number) {
    this.servicePlayer.search(name).subscribe((player: Player) => {
      this.player = player;

    });

  }







  restore() {

    let fecha = this.pipe.transform(Date.now(), 'dd/MM/yyyy');
    const date = new Date(fecha);
    this.player = {
      id: 0,
      first_name: '',
      last_name: '',
      nick: '',
      about: 'x cosa',
      position_id: 0,
      team_id: 1,
      //created_at: date,
      //updated_at: date,
      // def_img: 0,
      isSelected: false,
      player_number: 0,
      image: '',
      status: '',
      curp: '',
      extension: '',

    }
  }


}
