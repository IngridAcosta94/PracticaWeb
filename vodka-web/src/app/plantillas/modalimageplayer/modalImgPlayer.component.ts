import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlayerService } from 'src/services/player.service';
import { PhotoService } from 'src/services/photo.services';
import { Player, Photo } from 'src/shared/interfaces';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-modalImgPlayer',
  templateUrl: './modalImgPlayer.component.html',
  styleUrls: ['./modalImgPlayer.component.scss']
})
export class ModalImagePlayerComponent implements OnInit {

  today: Date = new Date();
  pipe = new DatePipe('en-US');
  formpost: FormGroup;
  formPhoto: FormGroup
  imageSrc: string = '';
  base64: string = '';
  status: string;
  player: Player;
  playerPost: Player;
  photo: Photo;
  idPlayer: number;
  file: string = '';
  
  constructor(public dialogRef: MatDialogRef<ModalImagePlayerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Player, private renderer: Renderer2, public service: PlayerService,
    public snakbar: MatSnackBar, public servicePhoto: PhotoService) {
    this.restore();
    this.player = data;
    
    this.formpost = new FormGroup({

      first_name: new FormControl(this.player.first_name),
      last_name: new FormControl(this.player.last_name),//PENDIENTE VALIDAR EL TELEFONO 
      //def_img: new FormControl(this.player.def_img),
      player_number: new FormControl(this.player.player_number),
      nick: new FormControl(this.player.nick),//PENDIENTE VALIDAR EL CORREO
      //created_at: new FormControl(this.player.created_at),
      position_id: new FormControl(this.player.position_id),
      about: new FormControl(this.player.about),
      //updated_at: new FormControl(this.player.updated_at),
      team_id: new FormControl(this.player.team_id),
      image: new FormControl(this.player.image),
      extension: new FormControl(this.player.extension),
      curp: new FormControl(this.player.curp),
      
      
    });



  }

  get f() {
    return this.formpost.controls;
  }

  ngOnInit(): void {
  }

  onClickNO(): void {

    this.dialogRef.close();


  }

  onFileChange(event: any , file : string) {

    debugger
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file1] = event.target.files;
      reader.readAsDataURL(file1);



      reader.onload = () => {

        let typeFile = file1.type.split("/");
        //console.log(prueba[1]);
        this.imageSrc = reader.result as string;
        reader.readAsBinaryString;

        //this.photo.extension = typeFile[1];
        //this.photo.imageStringBase64 = reader.result.toString();
        //console.log( this.photo.imageStringBase64);
        //this.photo.ph_name = file.name

        this.formpost.patchValue({
          image: reader.result,
          extension: typeFile[1],

        });

      };

    }
  }

  AddPhoto() {

    this.servicePhoto.register(this.photo).subscribe((respPhoto: Photo) => {

      //this.player.def_img = respPhoto.id;
     //this.team.t_emblem = respPhoto.ph_filename;
      console.log(respPhoto);

    });
  }


  EditPlayer(form: Player) {
    debugger

    // this.servicePhoto.register(this.photo).subscribe((respPhoto: Photo) => {

    //  if (respPhoto.id != null) {

    //  console.log(respPhoto);
        
        //form.t_emblem = respPhoto.ph_filename  ;
        //form.def_img = respPhoto.id;

       // this.playerPost = form;
        //this.playerPost.id = this.player.id;
        
        this.service.edit( this.player.id,form).subscribe((resp: Player) => {
          
          console.log(resp);
          if (resp.id != 0) {
            this.dialogRef.close();
            this.snakbar.open('Equipo actualizado con exito', '', {
              duration: 2000
            });
          }

          console.log(resp);
          
        });
    //   }

    // });

    //Primero se ejecuta esto y no se porque :v

  }


  restore() {

    let fecha = this.pipe.transform(Date.now(), 'dd/MM/yyyy');
    const date = new Date(fecha);

    console.log(date);

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
      curp:'',
      extension:'',

    }

    this.photo = {
      id: 0,
      ph_name: '',
      ph_descr: '',
      ph_filename: '',
      imageStringBase64: '',
      extension: '',
    }
  }

}