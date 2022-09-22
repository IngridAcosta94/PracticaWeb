import { Component, OnInit , Inject, Renderer2} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder,FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlayerService } from 'src/services/player.service';
import { Season, Pagination, Team, Player, Position,PlayerArray } from "src/shared/interfaces";
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { PositionService } from "src/services/position.service";





@Component({
  selector: 'app-modalReleasePlayer',
  templateUrl: './modalReleasePlayer.component.html',
  styleUrls: ['./modalReleasePlayer.component.scss']
})
export class ModalReleasePlayerComponent implements OnInit {



  player1: PlayerArray;
  
  form: FormGroup;
  categoriaSelectedArray = [];
  playersRelease: number [];
  isLoginDialogOpen: boolean = false;
  today: Date = new Date();
  pipe = new DatePipe('en-US');
  player: Player;
  playersGet: Player[];
  players: number[];
  playerPost: Player[];
  positions: Position[];
  error: boolean;
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  checkSelectedTeam: Team [];
 
  

  constructor(public dialogRef: MatDialogRef<ModalReleasePlayerComponent>,
    @Inject(MAT_DIALOG_DATA) public playerRelease1: Player[], private renderer: Renderer2, public servicePlayer: PlayerService,
    public snakbar: MatSnackBar,public fb: FormBuilder,public servicePosition: PositionService ) {
    
    this.masterSelected = false;
    this.error = false;
    this.players=[0];
     this.player1 = {players : [0]};
    this.playersGet = playerRelease1;
    this.playersRelease=[0];
    this.playerPost = [];
    this.categoriaSelectedArray= [];
    this.restore();

    this.form = new FormGroup({
      masterSelected : new FormControl(false)
    })

   

  }


  ngOnInit() {


  }
  
  onCategoriaPressed(categoriaSelected: any){

    this.masterSelected = this.form.get('masterSelected').value
    if (this.masterSelected) { //Si el elemento fue seleccionado
      //Agregamos la categoría seleccionada al arreglo de categorías seleccionadas
      this.categoriaSelectedArray.push(categoriaSelected);
    } else { //Si el elemento fue deseleccionado
      //Removemos la categoría seleccionada del arreglo de categorías seleccionadas
      this.categoriaSelectedArray.splice(this.categoriaSelectedArray.indexOf(categoriaSelected), 1);
    }

    console.log(this.categoriaSelectedArray)


  }

  

  releasePlayer() {

   
   this.categoriaSelectedArray.forEach(element => {

      this.playersRelease.push(element.id);
      console.log(this.playersRelease)
  
      
    });

    
    
    this.player1 =  {
      players: this.playersRelease
     };

      console.log(this.player1);

    this.servicePlayer.releasePlayer(this.player1).subscribe(resp => {//debe recibir un arreglo
      
     console.log(resp)
    });

    //this.load();


  }



  getPosition() {
    debugger
    this.error = true;
    this.servicePosition.list().subscribe(positions => {
      this.positions = positions.data;
      console.log(this.positions)

    });

  }


  onClickNO(): void {

    this.dialogRef.close();


  }

 
  restore() {
    let fecha = this.pipe.transform(Date.now(), 'dd/MM/yyyy');
    const date = new Date(fecha);
    this.player = {
      id: 0,
      first_name: '',
      last_name: '',
      nick: '',
      about: '',
      position_id: 0,
      //def_img: 0,
      team_id: 0,
      //created_at: date,
      //updated_at: date,
      isSelected: false,
      player_number: 0,
      image: '',
      status:'',
      curp: '',
      extension:'',

    }

    console.log(this.player)

  }

}






