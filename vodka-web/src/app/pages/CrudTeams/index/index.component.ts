import { Component, OnInit } from '@angular/core';
import { Team, Respuesta, Pagination } from 'src/shared/interfaces';
import { Router } from '@angular/router';
import { TeamService } from 'src/services/team.service'
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { MatDialog, MatDialogState } from '@angular/material/dialog';
import { ModalteamsComponent } from 'src/app/plantillas/modalteams/modalteams.component'

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  form: FormGroup;

  pagina: FormGroup;
  teams: Team[];
  team: Team;
  error: boolean;
  events: Event[];
  teamsOriginal: Team[];
  CantidadElemento: number;
  pagination: Pagination;
  isLoginDialogOpen: boolean = false;

  

  constructor(private router: Router, private service: TeamService, public http: HttpClient, public dialog: MatDialog) {
    this.error = false;
    this.teams = [];
    this.team;
    this.events = [];
    this.pagination;
    this.CantidadElemento = 25;

    this.form = new FormGroup({
      t_name: new FormControl('')
    });

  }



  ngOnInit() {

    this.load()

  }


  //Hacer de nuevo la misma petición pero pasar
  //Pintar el Next_page_pagination(URL) en mi boton y con el onclik lanzar la peticion src , href cuando yo le de click al bton me debe realizar
  //la peticion y literal esa URL que pinte la tengo que regresar al evento y mandarla de nuevo


  load() {

    this.error = true;
    this.service.get(this.CantidadElemento).subscribe(teams => {
      this.teams = teams.data;
      this.pagination = teams.pagination;
      // console.log(this.teams);
      //console.log(this.pagination);
      this.teamsOriginal = teams.data;
      //console.log(this.teamsOriginal);

      this.pagina = new FormGroup({
        link: new FormControl(this.pagination.next_page_url),
        linkprev: new FormControl(this.pagination.prev_page_url)


      })

    });
    //Cualquier cambio que suceda se vea reflejado
    this.form.valueChanges.subscribe(valores => {
      if (!valores) return;
      this.teams = this.teamsOriginal;
      this.findteams(valores);

      console.log(valores);
    })

  }
  
  get prueba(){
    if(this.teams && this.teams.length ){
      return true;
    }

    return false;
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
    this.service.getPagination(LinkPagination).subscribe(teams => {
      this.teams = teams.data;
      this.pagination = teams.pagination;
      console.log(this.pagination);

      this.pagina = new FormGroup({

        link: new FormControl(this.pagination.next_page_url),
        linkprev: new FormControl(this.pagination.prev_page_url)



      })


    });
  }



  previous(LinkPagination: string) {

    this.error = true;
    this.service.getPaginationPrevious(LinkPagination).subscribe(teams => {
      this.teams = teams.data;
      this.pagination = teams.pagination;
      console.log(this.teams);

      this.pagina = new FormGroup({

        link: new FormControl(this.pagination.next_page_url),
        linkprev: new FormControl(this.pagination.prev_page_url)

      })


    });

  }


  findteams(valores: any) {
    if (valores.t_name) {

      this.teams = this.teams.filter(t => t.t_name.indexOf(valores.t_name) !== -1);
    }

  }

  openDialog(): void {
    debugger

    if (this.isLoginDialogOpen) {
      return;
    }

    this.isLoginDialogOpen = true;
    const dialogRef = this.dialog.open(ModalteamsComponent,
      {
        width: '550px',
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

  openDialogEdit(idTeam: number): void {
    debugger
    //PRIMERO CONSULTAMOS LOS DATOS DEL TEAM A EDITAR MEDIANTE DETAIL DEL SERVICIO

    this.service.detail(idTeam).subscribe((team: Team) => {
      
      if (this.isLoginDialogOpen) {
        return;
      }
  
      this.isLoginDialogOpen = true;
      const dialogRef = this.dialog.open(ModalteamsComponent,
        {
          width: '550px',
          height: '600px',
          data: team,
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

  openDialogDelete(): void {
    debugger

    if (this.isLoginDialogOpen) {
      return;
    }

    this.isLoginDialogOpen = true;
    const dialogRef = this.dialog.open(ModalteamsComponent,
      {
        width: '550px',
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








}
