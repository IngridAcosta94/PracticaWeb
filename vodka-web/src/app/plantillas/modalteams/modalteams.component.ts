import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TeamService } from 'src/services/team.service';
import { PhotoService } from 'src/services/photo.services';
import { Team, Photo } from 'src/shared/interfaces';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';


@Component({
  selector: 'app-modalteams',
  templateUrl: './modalteams.component.html',
  styleUrls: ['./modalteams.component.scss'],

})

export class ModalteamsComponent implements OnInit {

  formpost: FormGroup;
  formPhoto: FormGroup
  imageSrc: string = '';
  base64: string = '';
  status: string;
  team: Team;
  photo: Photo;
  constructor(public dialogRef: MatDialogRef<ModalteamsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Team, private renderer: Renderer2, public service: TeamService,
    public snakbar: MatSnackBar, public servicePhoto: PhotoService) {
    this.restore();
    this.team = data;
    this.formpost = new FormGroup({
      id: new FormControl(this.team.id),
      t_name: new FormControl(this.team.t_name),
      Phone: new FormControl(''),//PENDIENTE VALIDAR EL TELEFONO 
      Manager: new FormControl(''),
      Email: new FormControl(''),//PENDIENTE VALIDAR EL CORREO
      t_city: new FormControl(this.team.t_city),
      t_descr: new FormControl(this.team.t_descr),
      t_emblem: new FormControl(this.team.t_emblem),
      file: new FormControl('', [Validators.required]),
      //fileSource: new FormControl('', [Validators.required]),
      t_yteam: new FormControl(this.team.t_yteam),
      players: new FormControl(this.team.players),
      def_img: new FormControl(this.team.def_img)
    });



  }

  get f() {
    return this.formpost.controls;
  }

  ngOnInit(): void {
    if(this.formpost.get('t_emblem').value != ""){
      this.imageSrc = "https://ligasabatinadefutbol.com.mx/media/bearleague/" + this.formpost.get('t_emblem').value;
    }else{
      this.imageSrc = "";
    }
    
  }

  onClickNO(): void {

    this.dialogRef.close();


  }

  onFileChange(event: any) {

    debugger
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);



      reader.onload = () => {

        let typeFile = file.type.split("/");
        //console.log(prueba[1]);
        this.imageSrc = reader.result as string;
        reader.readAsBinaryString;

        this.photo.extension = typeFile[1];
        this.photo.imageStringBase64 = reader.result.toString();
       
      };

    }
  }

  AddPhoto() {

    this.servicePhoto.register(this.photo).subscribe((respPhoto: Photo) => {
      this.team.def_img = respPhoto.id;
      this.team.t_emblem = respPhoto.ph_filename;
      console.log(respPhoto);

    });
  }


  //POST
  AddTeams(form: Team) {
    debugger

    if(form.id != 0){

      

      this.servicePhoto.edit( form.def_img,this.photo).subscribe((respPhoto: Photo) => {

        //ESTO YA EDITO ENTONCES respPhoto = respuesta que es un objeto
        if (respPhoto.id != 0) {
          
          //id siempre va ser diferente de 0
          //Ese objeto que tu optines te va regresar un objeto y de ese objeto vaz a extraer el nombre del archivo
          // y el id 
          form.t_emblem = respPhoto.ph_filename  ;
          form.def_img = respPhoto.id;
          this.service.edit( form.id , form).subscribe((resp: Team) => {
            //Entonces ya edito 
            if (resp.id != 0) {
              this.dialogRef.close();
              this.snakbar.open('Equipo registrado con exito', '', {
                duration: 2000
              });
            }
  
            console.log(resp);
          });
        }
  
      });


      // this.service.edit(form).subscribe((resp: Team) => {
        
      //   if (resp.id != null) {
      //     this.dialogRef.close();
      //     this.snakbar.open('Equipo actualizado con exito', '', {
      //       duration: 2000
      //     });
      //   }

      //   console.log(resp);
      // });
       

    }else{

      this.servicePhoto.register(this.photo).subscribe((respPhoto: Photo) => {

        if (respPhoto.id != null) {
          
          form.t_emblem = respPhoto.ph_filename;
          form.def_img = respPhoto.id;
          this.service.register(form).subscribe((resp: Team) => {
            
            if (resp.id != null) {
              this.dialogRef.close();
              this.snakbar.open('Equipo registrado con exito', '', {
                duration: 2000
              });
            }
  
            console.log(resp);
          });
        }
  
      });

    }

   

    //Primero se ejecuta esto y no se porque :v

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
      isSelected:false,
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