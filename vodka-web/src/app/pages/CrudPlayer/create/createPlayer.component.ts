import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogState } from "@angular/material/dialog";
import { Season, Pagination, Team, Player, Position } from "src/shared/interfaces";
import { SeasonService } from "src/services/season.service";
import { TeamService } from "src/services/team.service";
import { PlayerService } from "src/services/player.service";
import { PositionService } from "src/services/position.service";
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormArray, FormBuilder } from "@angular/forms";
import { ModalseasonComponent } from "src/app/Plantillas/modalseason/modalseason.component";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-create',
  templateUrl: './createPlayer.component.html',
  styleUrls: ['./createPlayer.component.scss']
})
export class CreatePlayerComponent implements OnInit {


  form = this.fb.group({
    players: this.fb.array([])
  });


  today: Date = new Date();
  pipe = new DatePipe('en-US');
  page: FormGroup;
  season: Season;
  //seasons: Season[];
  itemsPlayer: [];
  team: Team;
  player: Player;
  playerPost: Player[];
  teams: Team[];
  positions: Position[];
  error: boolean;
  teamsOriginal: Team[];
  limit: number;
  pagination: Pagination;
  isLoginDialogOpen: boolean = false;
  ListTeams1: Team[];
  teamsSelected: Team[];
  teamsId: number[];
  constructor(
    private router: Router,
    private service: SeasonService,
    public dialog: MatDialog,
    public teamService: TeamService,
    public snakbar: MatSnackBar,
    public servicePlayer: PlayerService,
    public servicePosition: PositionService,
    public fb: FormBuilder
  ) {
    this.itemsPlayer=[];
    this.error = false;
    this.player;
    this.season;
    this.team;
    this.teams = [];
    this.positions
    this.teamsId = [];
    this.pagination;
    this.limit = 25;
    this.ListTeams1 = [];
    this.teamsSelected = [];
    this.playerPost = []
    this.restore();
    


  }

  get players() {
    return this.form.controls["players"] as FormArray;
  }

  ngOnInit() {

    const lessonForm = this.fb.group({
      first_name: new FormControl(this.player.first_name),
      last_name: new FormControl(this.player.last_name),
      nick: new FormControl(this.player.nick),
      about: new FormControl(this.player.about),
      player_number: new FormControl(this.player.player_number),
      position_id: new FormControl(this.player.position_id),
      team_id: new FormControl(this.player.team_id),
      //created_at: new FormControl(this.player.created_at),
     // updated_at: new FormControl(this.player.updated_at),
      //def_img: new FormControl(this.player.def_img),
    });
    this.players.push(lessonForm);
    this.getPosition();
  }

  getPosition() {
    debugger
    this.error = true;
    this.servicePosition.list().subscribe(positions => {
      this.positions = positions.data;
      console.log(this.positions)

    });

  }


  addPlayerForm() {
    const lessonForm = this.fb.group({
      first_name: new FormControl(this.player.first_name),
      last_name: new FormControl(this.player.last_name),
      nick: new FormControl(this.player.nick),
      about: new FormControl(this.player.about),
      player_number: new FormControl(this.player.player_number),
      position_id: new FormControl(this.player.position_id),
      team_id: new FormControl(this.player.team_id),
      //created_at: new FormControl(this.player.created_at),
      //updated_at: new FormControl(this.player.updated_at),
      //def_img: new FormControl(this.player.def_img),
    });

    this.players.push(lessonForm);
  }



  removeFormInput(i) {
    this.players.removeAt(i);
  }


  openDialog(): void {
    debugger;

    const temporalSeason = localStorage.getItem("season");

    if (temporalSeason === null) {

      this.season = this.season
      if (this.isLoginDialogOpen) {


        return;
      }

      this.isLoginDialogOpen = true;
      const dialogRef = this.dialog.open(ModalseasonComponent, {
        width: "550px",
        height: "600px",
        data: this.season,
      });
      if (dialogRef.getState() === MatDialogState.OPEN) {
      }
      dialogRef.afterClosed().subscribe((res) => {
        console.log(res);
        this.isLoginDialogOpen = false;

      });

    } else {

      this.season = JSON.parse(temporalSeason);

      if (this.isLoginDialogOpen) {
        return;
      }

      this.isLoginDialogOpen = true;
      const dialogRef = this.dialog.open(ModalseasonComponent, {
        width: "550px",
        height: "600px",
        data: this.season,
      });
      if (dialogRef.getState() === MatDialogState.OPEN) {
      }
      dialogRef.afterClosed().subscribe((res) => {
        console.log(res);
        this.isLoginDialogOpen = false;

      });

    }

  }


  addPlayer() {

    debugger
  
      this.itemsPlayer = this.form.getRawValue()
      this.playerPost = this.itemsPlayer['players'];
      console.log(this.playerPost );

    console.log(this.playerPost)

    
    
    this.servicePlayer.registerPlayer(this.playerPost).subscribe((resp: Player[]) => {
       if(resp.length){
        location.reload();

        this.snakbar.open('Jugadores registrados con exito', '', {
          duration: 2000
        });
       }

     console.log(resp)
    });

    //this.load();


  }


  isShown: boolean = false; // hidden by default
  temporal = localStorage.getItem("teamsSelected");
  enableButton() {
    //const temporal = localStorage.getItem("teamsSelected");
    this.isShown = !this.isShown;

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
      //def_img: 0,
      isSelected: false,
      player_number: 0,
      image: '',
      status:'',
      curp:'',
      extension:'',


    }
  }

}
