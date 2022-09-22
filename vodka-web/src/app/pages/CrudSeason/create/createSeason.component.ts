import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogState } from "@angular/material/dialog";
import { Season, Pagination, Team } from "src/shared/interfaces";
import { SeasonService } from "src/services/season.service";
import { TeamService } from "src/services/team.service";
import { Router } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";
import { ModalseasonComponent } from "src/app/Plantillas/modalseason/modalseason.component";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: "app-createSeason",
  templateUrl: "./createSeason.component.html",
  styleUrls: ["./createSeason.component.scss"],
})
export class CreateSeasonComponent implements OnInit {
  form: FormGroup;
  formpost: FormGroup;
  page: FormGroup;
  season: Season;
  //seasons: Season[];
  team: Team;
  teams: Team[];
  error: boolean;
  teamsOriginal: Team[];
  limit: number;
  pagination: Pagination;
  isLoginDialogOpen: boolean = false;
  ListTeams1: Team[];
  teamsSelected: Team[];
  teamsId: number[];

  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  checkSelectedTeam: Team [];

  constructor(
    private router: Router,
    private service: SeasonService,
    public dialog: MatDialog,
    public teamService: TeamService,
    public snakbar: MatSnackBar,
  ) {
    this.error = false;
    //this.seasons = [];
    this.masterSelected = false;
    this.season;
    this.team;
    this.teams = [];
    this.teamsId = [];
    this.pagination;
    this.limit = 25;
    this.ListTeams1 = [];
    this.teamsSelected = [];
    this.form = new FormGroup({
      t_name: new FormControl(""),
    });
    this.restore();
    this.formpost = new FormGroup({
      s_name: new FormControl(this.season.s_name),
      s_draw_away: new FormControl(this.season.s_draw_away),//PENDIENTE VALIDAR EL TELEFONO 
      s_descr: new FormControl(this.season.s_descr),
      published: new FormControl(this.season.published),//PENDIENTE VALIDAR EL CORREO
      s_draw_point: new FormControl(this.season.s_draw_point),
      s_enbl_extra: new FormControl(this.season.s_enbl_extra),
      s_extra_lost: new FormControl(this.season.s_extra_lost),
      s_extra_win: new FormControl(this.season.s_extra_win),
      s_groups: new FormControl(this.season.s_groups),
      s_lost_away: new FormControl(this.season.s_lost_away),
      s_lost_point: new FormControl(this.season.s_lost_point),
      s_rounds: new FormControl(this.season.s_rounds),
      s_win_away: new FormControl(this.season.s_win_away),
      s_win_point: new FormControl(this.season.s_win_point),
      t_id: new FormControl(this.season.t_id),
      teams: new FormControl([0]),
      masterSelected : new FormControl(false),

      isSelected : new FormControl(this.season.isSelected),
      
    });

   


  }

  ngOnInit() {
    this.load();
    this.get_localStorage();
  }

  getLink() {
    this.page.get("link").value;
    this.next(this.page.get("link").value);
  }

  getLinkPrev() {
    this.page.get("linkprev").value;
    this.previous(this.page.get("linkprev").value);
  }

  next(LinkPagination: string) {
    this.error = true;
    this.teamService.getPagination(LinkPagination).subscribe((teams) => {
      this.teams = teams.data;
      this.pagination = teams.pagination;
      console.log(this.pagination);

      this.page = new FormGroup({
        link: new FormControl(this.pagination.next_page_url),
        linkprev: new FormControl(this.pagination.prev_page_url),
      });
    });
  }

  previous(LinkPagination: string) {
    this.error = true;
    this.teamService
      .getPaginationPrevious(LinkPagination)
      .subscribe((teams) => {
        this.teams = teams.data;
        this.pagination = teams.pagination;
        console.log(this.teams);

        this.page = new FormGroup({
          link: new FormControl(this.pagination.next_page_url),
          linkprev: new FormControl(this.pagination.prev_page_url),
        });
      });
  }

  findteams(valores: any) {
    debugger
    if (valores.t_name) {
      this.teams = this.teams.filter(
        (t) => t.t_name.indexOf(valores.t_name) !== -1
      );
    }
  }



  openDialog(): void {
    debugger;

    const temporalSeason = localStorage.getItem("season");
    //this.season = temporalSeason ? JSON.parse(temporalSeason) : this.season;
    //this.season = JSON.parse(localStorage.getItem("season"));

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
        this.load();
      });


    } else {

      this.season = JSON.parse(temporalSeason);

      //const dataSeason = this.season;
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
        this.load();
      });

    }

  }






  load() {

    debugger
    const temporal = localStorage.getItem("teamsSelected");
    this.teamsSelected = temporal ? JSON.parse(temporal) : [];

    if (!this.teamsSelected.length)
      localStorage.setItem("teamsSelected", JSON.stringify(this.teamsSelected));

    this.teamService.get(this.limit).subscribe((teams) => {
      this.teams = teams.data.filter(
        (team) => this.teamsSelected.findIndex((t) => t.id == team.id) == -1
      );
      this.teamsOriginal = teams.data;
    });


    //Cualquier cambio que suceda se vea reflejado
    this.form.valueChanges.subscribe(valores => {
      if (!valores) return;
      this.teams = this.teamsOriginal;
      this.findteams(valores);

      // console.log(valores);
    });
    

  }

  
checkUncheckAll() {

  this.masterSelected = this.formpost.get('masterSelected').value

 for (var i = 0; i < this.teams.length; i++) {
   this.teams[i].isSelected = this.masterSelected;
 }
 this.getCheckedItemList();
 }

isAllSelected() {
   this.masterSelected = this.teams.every(function(item:any) {
    return item.isSelected == true;
  })
 this.getCheckedItemList();
}

getCheckedItemList(){
this.checkedList = [];
 for (var i = 0; i < this.teams.length; i++) {
if(this.teams[i].isSelected)
  this.checkedList.push(this.teams[i]);
 }
 localStorage.setItem("teamsSelected", JSON.stringify(this.checkedList));
this.load();
  
 }

  addSeason(form: Season) {

    debugger
    teamsId: [];
    this.season = JSON.parse(localStorage.getItem("season"));
    this.teams = JSON.parse(localStorage.getItem("teamsSelected"));
    this.teams.forEach(element => {
      this.teamsId.push(element.id);
    });


    form.s_descr = this.season.s_descr;
    form.s_draw_away = this.season.s_draw_away;
    form.s_draw_point = this.season.s_draw_point;
    form.s_enbl_extra = this.season.s_enbl_extra;
    form.s_extra_lost = this.season.s_extra_lost;
    form.s_extra_win = this.season.s_extra_win;
    form.s_lost_away = this.season.s_lost_away;
    form.s_lost_point = this.season.s_lost_point;
    form.s_groups = this.season.s_groups;
    form.s_win_point = this.season.s_win_point;
    form.s_win_away = this.season.s_win_away;
    form.teams = this.teamsId;

    this.service.register(form).subscribe((resp: Season) => {

      if (resp.s_id != null) {

        localStorage.removeItem('season');//NO LO ESTA ELIMINANDO
        localStorage.removeItem('teamsSelected');
        
        location.reload();

        this.snakbar.open('Torneo registrado con exito', '', {
          duration: 2000
        });
      }
    });

     //this.load();
     

  }

  get_localStorage() {
    this.teamsSelected = JSON.parse(localStorage.getItem("teamsSelected"));


  }

  AddLocalStorage() {
    localStorage.setItem("teamsSelected", JSON.stringify(this.teamsSelected));
  }

  AddLocalStorageSeason(form: Season) {
    localStorage.setItem("season", JSON.stringify(form));
  }

  drop($event: CdkDragDrop<Team[]>) {
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
      ),
        this.AddLocalStorage();
  }


  deleteItem(id: number) {
    debugger
    this.teamsSelected = this.teamsSelected.filter((i) => i.id !== id);

    this.AddLocalStorage();
    this.load();

  }

  search(name: number) {
    this.teamService.search(name).subscribe((team: Team) => {
      this.team = team;

    });

  }

  isShown: boolean = false ; // hidden by default
  temporal = localStorage.getItem("teamsSelected");
  enableButton() {
   //const temporal = localStorage.getItem("teamsSelected");
  this.isShown = ! this.isShown;
  
  }



  restore() {
    this.season = {
      s_id: 0,
      s_name: '',
      s_descr: '',
      s_rounds: 0,
      t_id: 1,
      published: '',
      s_win_point: '',
      s_lost_point: '',
      s_enbl_extra: 0,
      s_extra_win: '',
      s_extra_lost: '',
      s_draw_point: '',
      s_groups: 0,
      s_win_away: '',
      s_draw_away: '',
      s_lost_away: '',
      teams: [],
      isSelected: false,

    }
  }

}
