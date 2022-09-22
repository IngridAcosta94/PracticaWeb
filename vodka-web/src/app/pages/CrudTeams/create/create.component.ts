import { Component, OnInit } from '@angular/core';
import { Team, Respuesta, Pagination } from 'src/shared/interfaces';
import { Router } from '@angular/router';
import { TeamService } from 'src/services/team.service'
import { EventService } from 'src/services/event.service'
import { FormGroup, FormControl } from '@angular/forms';
import{MatDialog} from '@angular/material/dialog';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {


  formTeam : FormGroup;
  team :Team;

/*id: number;
  t_name: string;
  t_descr: string;
  t_yteam: string;
  def_img: number;
  t_emblem: string;
  t_city: string;*/

  constructor(private route : Router, private service : TeamService,  public dialog: MatDialog) {
    this.restore();
    this.formTeam = new FormGroup({
    t_name : new FormControl (this.team.t_name),
    t_descr : new FormControl (this.team.t_descr),
    t_yteam : new FormControl (this.team.t_yteam),// ESTE SERA UN CHECKBOX TRUE OR FALSE
    def_img : new FormControl (this.team.def_img),//
    t_emblem : new FormControl (this.team.t_emblem),//ESTE SERA UN INPUT TIPO FILE
    t_city : new FormControl (this.team.t_city),


    })


   }

  ngOnInit(): void {
  }

  postForm(form : Team){
    //CONVERTIR A BASE 64 la imagen
   this.service.register(form).subscribe(data =>{
    console.log(data)
   })



  }

  restore() {
    this.team = {
      id: 0,
      t_name: '',
      t_descr: '',
      t_yteam: '',
      def_img: 0,
      t_emblem: '',
      t_city: '',
      players: [],
      isSelected: false,
    }
  }



}





