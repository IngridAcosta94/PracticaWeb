import { Component, OnInit, Inject,Renderer2  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {SeasonService} from 'src/services/season.service';
import { Season} from 'src/shared/interfaces';
import {MatSnackBar, MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';



@Component({
  selector: 'app-modalseason',
  templateUrl: './modalseason.component.html',
  styleUrls: ['./modalseason.component.scss']
})
export class ModalseasonComponent implements OnInit {

  formpost: FormGroup;
  base64: string = '';
  status: string;
  season: Season;
  constructor(public dialogRef: MatDialogRef<ModalseasonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Season, private renderer: Renderer2, public service: SeasonService,
    public snakbar: MatSnackBar) {
    this.restore();
    this.season = data;
    this.formpost = new FormGroup({
      s_name: new FormControl(this.season.s_name),
      s_descr: new FormControl(this.season.s_descr),//PENDIENTE VALIDAR EL TELEFONO 
      s_rounds: new FormControl(this.season.s_rounds),
      s_id: new FormControl(this.season.s_id),//PENDIENTE VALIDAR EL CORREO
      published: new FormControl(this.season.published),
      s_win_point: new FormControl(this.season.s_win_point),
      s_lost_point: new FormControl(this.season.s_lost_point),
      s_enbl_extra: new FormControl(this.season.s_enbl_extra),
      s_extra_win: new FormControl(this.season.s_extra_win),
      s_extra_lost: new FormControl(this.season.s_extra_lost),
      s_draw_point: new FormControl(this.season.s_draw_point),
      s_groups: new FormControl(this.season.s_groups),
      s_win_away: new FormControl(this.season.s_win_away),
      s_draw_away: new FormControl(this.season.s_draw_away),
      s_lost_away: new FormControl(this.season.s_lost_away),
    });


  }

  get f() {
    return this.formpost.controls;
  }

  ngOnInit(): void {


    debugger
    const temporal = localStorage.getItem("season");
    //this.season = temporal ? JSON.parse(temporal) : "";

    if (temporal === null){
      localStorage.setItem("season", JSON.stringify(this.season));
    }

  }

 
  
  AddSeason(form: Season) {
    debugger
    this.service

    this.service.register(form).subscribe((resp: Season) => {

      if (resp.t_id != null) {
        this.dialogRef.close();
        this.snakbar.open('configuraciones guardadas con exito', '', {
          duration: 2000
        });
      }
    });
  }


  addStorageSeason(form: Season){

    debugger

    localStorage.setItem("season", JSON.stringify(form));

    if (localStorage != null) {
      this.dialogRef.close();
      this.snakbar.open('Configuraciones guardadas', '', {
        duration: 2000
      });
    }
  }


  restore() {
    this.season = {
      s_id: 0,
      s_name: '',
      s_descr: '',
      s_rounds: 0,
      t_id: 0,
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

  active = 0;

  onTabChange(e) {
    console.log(e)
  }

isShown: boolean = false ; // hidden by default

toggleShow() {

this.isShown = ! this.isShown;

}


}
