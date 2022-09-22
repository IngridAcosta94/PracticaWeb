import { Component, OnInit } from '@angular/core';
import { Team, Respuesta, Pagination, Season } from 'src/shared/interfaces';
import { Router } from '@angular/router';
import { TeamService } from 'src/services/team.service';
import { SeasonService } from 'src/services/season.service';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { MatDialog, MatDialogState } from '@angular/material/dialog';
import { ModalteamsComponent } from 'src/app/plantillas/modalteams/modalteams.component'

@Component({
  selector: 'app-index',
  templateUrl: './indexSeason.component.html',
  styleUrls: ['./indexSeason.component.scss']
})
export class IndexSeasonComponent implements OnInit {


  
  form: FormGroup;
  pagina: FormGroup;
  seasons: Season[];
  error: boolean;
  events: Event[];
  seasonsOriginal: Season[];
  CantidadElemento: number;
  pagination: Pagination;
  isLoginDialogOpen: boolean = false;
  //routerLinkCreate : string;

  constructor(private router: Router, private service: SeasonService, public http: HttpClient, public dialog: MatDialog) {
    this.error = false;
    this.seasons = [];
    this.events = [];
    this.pagination;
    this.CantidadElemento = 25;
   // this.routerLinkCreate = '/createSeason'
    this.form = new FormGroup({
      s_name: new FormControl('')
    });

  }



  ngOnInit() {

    this.CargarRegistros()

  }


  //Hacer de nuevo la misma petición pero pasar
  //Pintar el Next_page_pagination(URL) en mi boton y con el onclik lanzar la peticion src , href cuando yo le de click al bton me debe realizar
  //la peticion y literal esa URL que pinte la tengo que regresar al evento y mandarla de nuevo


  CargarRegistros() {

    this.error = true;
    this.service.get(this.CantidadElemento).subscribe(seasons => {
      this.seasons = seasons.data;
      this.pagination = seasons.pagination;
      // console.log(this.teams);
      //console.log(this.pagination);
      this.seasonsOriginal = seasons.data;
      //console.log(this.teamsOriginal);

      this.pagina = new FormGroup({
        link: new FormControl(this.pagination.next_page_url),
        linkprev: new FormControl(this.pagination.prev_page_url)


      })

    });

    //Cualquier cambio que suceda se vea reflejado
    this.form.valueChanges.subscribe(valores => {
      if (!valores) return;
      this.seasons = this.seasonsOriginal;
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


  getLink() {
    this.pagina.get('link').value;
    this.next(this.pagina.get('link').value)
  }

  getLinkPrev() {
    this.pagina.get('linkprev').value;
    this.previous(this.pagina.get('linkprev').value)
  }


  next(LinkPagination: string) {

    this.error = true;
    this.service.getPagination(LinkPagination).subscribe(seasons => {
      this.seasons = seasons.data;
      this.pagination = seasons.pagination;
      console.log(this.pagination);

      this.pagina = new FormGroup({

        link: new FormControl(this.pagination.next_page_url),
        linkprev: new FormControl(this.pagination.prev_page_url)



      })


    });
  }



  previous(LinkPagination: string) {

    this.error = true;
    this.service.getPaginationPrevious(LinkPagination).subscribe(seasons => {
      this.seasons = seasons.data;
      this.pagination = seasons.pagination;
      console.log(this.seasons);

      this.pagina = new FormGroup({

        link: new FormControl(this.pagination.next_page_url),
        linkprev: new FormControl(this.pagination.prev_page_url)

      })


    });

  }


  findteams(valores: any) {
    if (valores.s_name) {

      this.seasons = this.seasons.filter(t => t.s_name.indexOf(valores.s_name) !== -1);
    }

  }

}
