import { Component, OnInit } from '@angular/core';
import { Player,Team, Respuesta, Pagination } from 'src/shared/interfaces';
import { Router } from '@angular/router';
import { TeamService } from 'src/services/team.service';
import{PlayerService} from 'src/services/player.service';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { MatDialog, MatDialogState } from '@angular/material/dialog';
import { ModalteamsComponent } from 'src/app/plantillas/modalteams/modalteams.component';
import{ModalReleasePlayerComponent} from 'src/app/plantillas/modalReleasePlayer/modalReleasePlayer.component';
import{ModalImagePlayerComponent} from 'src/app/plantillas/modalimageplayer/modalImgPlayer.component';
import{ModalPlayerComponent} from 'src/app/plantillas/modalPlayer/modalPlayer.component';

@Component({
  selector: 'app-index-player',
  templateUrl: './indexPlayer.component.html',
  styleUrls: ['./indexPlayer.component.scss']
})
export class IndexPlayerComponent implements OnInit {

  form: FormGroup;

  pagina: FormGroup;
  teams: Team[];
  players: Player[];
  playersData: Player[];
  error: boolean;
  events: Event[];
  playersOriginal: Player[];
  CantidadElemento: number;
  pagination: Pagination;
  isLoginDialogOpen: boolean = false;

  constructor(private router: Router, private service: TeamService, public http: HttpClient, public dialog: MatDialog, public servicePlayer: PlayerService) {
    this.error = false;
    this.teams = [];
    this.players=[];
    this.playersData=[];
    this.events = [];
    this.pagination;
    this.CantidadElemento = 25;

    this.form = new FormGroup({
      first_name: new FormControl('')
    });

  }



  ngOnInit() {

    this.load()

  }


  //Hacer de nuevo la misma petición pero pasar
  //Pintar el Next_page_pagination(URL) en mi boton y con el onclik lanzar la peticion src , href cuando yo le de click al bton me debe realizar
  //la peticion y literal esa URL que pinte la tengo que regresar al evento y mandarla de nuevo


  load() {

    debugger
    this.error = true;
    this.servicePlayer.get(this.CantidadElemento).subscribe(players => {
      this.players = players.data;
      this.pagination = players.pagination;
      // console.log(this.teams);
      //console.log(this.pagination);
      this.playersOriginal = players.data;
      //console.log(this.teamsOriginal);

      this.pagina = new FormGroup({
        link: new FormControl(this.pagination.next_page_url),
        linkprev: new FormControl(this.pagination.prev_page_url)


      })
      console.log(this.players)

    });

    //Cualquier cambio que suceda se vea reflejado
    this.form.valueChanges.subscribe(valores => {
      if (!valores) return;
      this.players = this.playersOriginal;
      this.findteams(valores);

      console.log(valores);
    })

  }

  obtenerLink() {
    this.pagina.get('link').value;
    this.next(this.pagina.get('link').value)
  }

  obtenerLinkPrev() {
    this.pagina.get('linkprev').value;
    this.previous(this.pagina.get('linkprev').value)
  }


  next(LinkPagination: string) {

    this.error = true;
    this.servicePlayer.getPagination(LinkPagination).subscribe(players => {
      this.players = players.data;
      this.pagination = players.pagination;
      console.log(this.pagination);

      this.pagina = new FormGroup({

        link: new FormControl(this.pagination.next_page_url),
        linkprev: new FormControl(this.pagination.prev_page_url)



      })


    });
  }



  previous(LinkPagination: string) {

    this.error = true;
    this.servicePlayer.getPaginationPrevious(LinkPagination).subscribe(players => {
      this.players = players.data;
      this.pagination = players.pagination;
      console.log(this.players);

      this.pagina = new FormGroup({

        link: new FormControl(this.pagination.next_page_url),
        linkprev: new FormControl(this.pagination.prev_page_url)

      })


    });

  }


  findteams(valores: any) {
    if (valores.first_name) {

      this.players = this.players.filter(t => t.first_name.indexOf(valores.first_name) !== -1);
    }

  }

  openDialogPhoto(idPlayer: number): void {
    debugger
    //PRIMERO CONSULTAMOS LOS DATOS DEL TEAM A EDITAR MEDIANTE DETAIL DEL SERVICIO

    this.servicePlayer.detail(idPlayer).subscribe((player: Player) => {
      
      if (this.isLoginDialogOpen) {
        return;
      }
  
      this.isLoginDialogOpen = true;
      const dialogRef = this.dialog.open(ModalImagePlayerComponent,
        {
          width: '550px',
          height: '600px',
          data: player,
        });
      if(dialogRef.getState() === MatDialogState.OPEN ){
          
        
      }
      dialogRef.afterClosed().subscribe(res => {
        console.log(res);
        this.isLoginDialogOpen = false;
        this.load();
      });
  
    });

    
  }


  openDialogCreate(): void {
    debugger

    if (this.isLoginDialogOpen) {
      return;
    }

    this.isLoginDialogOpen = true;
    const dialogRef = this.dialog.open(ModalPlayerComponent,
      {
        width: '1000px',
        height: '600px',
        data: '',
      });
    if(dialogRef.getState() === MatDialogState.OPEN ){
        
      
    }
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      this.isLoginDialogOpen = false;
      this.load();
    });
  }

openDialogRelease(): void {
    debugger

    this.servicePlayer.get(this.CantidadElemento).subscribe(players => {
      this.playersData = players.data;
      
      console.log(this.players)

      if (this.isLoginDialogOpen) {
        return;
      }
  
      this.isLoginDialogOpen = true;
      const dialogRef = this.dialog.open(ModalReleasePlayerComponent,
        {
          width: '1000px',
          height: '600px',
          data: this.playersData,
        });
      if(dialogRef.getState() === MatDialogState.OPEN ){
          
        
      }
      dialogRef.afterClosed().subscribe(res => {
        console.log(res);
        this.isLoginDialogOpen = false;
        this.load();
      });

    });

    
  }


}
