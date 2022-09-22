import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogState } from "@angular/material/dialog";
import { Season, Pagination, Team, Player, Position, PlayerArray } from "src/shared/interfaces";
import { SeasonService } from "src/services/season.service";
import { TeamService } from "src/services/team.service";
import { PlayerService } from "src/services/player.service";
import { PositionService } from "src/services/position.service";
import { Router } from "@angular/router";
import{FormGroup, FormControl} from '@angular/forms';
import { ModalseasonComponent } from "src/app/Plantillas/modalseason/modalseason.component";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
// import pdfmake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfmake.vfs = pdfFonts.pdfMake.vfs;

 declare var require: any;

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import html2canvas  from 'html2canvas';
// const htmlToPdfmake = require("html-to-pdfmake");
 (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;



@Component({
  selector: 'app-reporteCedula',
  templateUrl: './reporteCedula.component.html',
  styleUrls: ['./reporteCedula.component.scss']
})
export class ReporteCedulaComponent implements OnInit {

  player1: PlayerArray;
  today: Date = new Date();
  pipe = new DatePipe('en-US');
  itemsPlayer: [];
  player: Player;
  players: Player[];
  playerPost: Player[];
  playersActive: number[];
  positions: Position[];
  error: boolean;
  playersOriginal: Player[];
  limit: number;
  pagination: Pagination;
  isLoginDialogOpen: boolean = false;
  playersSelected: Player[];
  teamsId: number[];
  form: FormGroup;
  status: boolean;
  imageSrc: string = '';

  constructor(
    private router: Router,
    private service: SeasonService,
    public dialog: MatDialog,
    public teamService: TeamService,
    public snakbar: MatSnackBar,
    public servicePlayer: PlayerService,
    public servicePosition: PositionService,



  ) {


    this.status= true;
    this.player1 = {players : [0]};
    this.itemsPlayer=[];
    this.playersOriginal = [];
    this.error = false;
    this.player;
    this.players = [];
    this.playersActive= [0];
    this.positions;
    this.teamsId = [];
    this.pagination;
    this.limit = 25;
    this.playersSelected = [];
    this.playerPost = []
    this.restore();
    this.form = new FormGroup({
      first_name: new FormControl(""),
    });



   }

  ngOnInit(): void {
    this.load();
  }


  createPdf(){

    const pdfDefinition: any = {
      content: [
          {
            // if you specify both width and height - image will be stretched
            image: 'data:image/jpeg;base64,/9j/4QBARXhpZgAASUkqAAgAAAABAJiCAgAbAAAAGgAAAAAAAADCqSBNSUdVRUwgUlVJWi9GQ0JBUkNFTE9OQQAAAAD/7AARRHVja3kAAQAEAAAAPAAA/+EEuGh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBSaWdodHM9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9yaWdodHMvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBSaWdodHM6TWFya2VkPSJUcnVlIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQ2NzVBMjlDRjRGNTExRTFCOTQ2REFFMzkzQThBOURBIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQ2NzVBMjlCRjRGNTExRTFCOTQ2REFFMzkzQThBOURBIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgTWFjaW50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9IjQ2RTM1OEQyMTBCOEM2QzcyQ0I5QjZFRUE5RDBGODZEIiBzdFJlZjpkb2N1bWVudElEPSI0NkUzNThEMjEwQjhDNkM3MkNCOUI2RUVBOUQwRjg2RCIvPiA8ZGM6cmlnaHRzPiA8cmRmOkFsdD4gPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij7CqSBNSUdVRUwgUlVJWi9GQ0JBUkNFTE9OQTwvcmRmOmxpPiA8L3JkZjpBbHQ+IDwvZGM6cmlnaHRzPiA8ZGM6Y3JlYXRvcj4gPHJkZjpTZXE+IDxyZGY6bGk+wqkgTUlHVUVMIFJVSVovRkNCQVJDRUxPTkE8L3JkZjpsaT4gPC9yZGY6U2VxPiA8L2RjOmNyZWF0b3I+IDxkYzp0aXRsZT4gPHJkZjpBbHQ+IDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+Q0FSQVM8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv/tAGZQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAALhwBWgADGyVHHAIAAAIAAhwCdAAawqkgTUlHVUVMIFJVSVovRkNCQVJDRUxPTkE4QklNBCUAAAAAABD4lRfCj5ZKvvynaLPIx3l7/+4AJkFkb2JlAGTAAAAAAQMAFQQDBgoNAAAW9wAAG7kAACwKAABHFP/bAIQABgQEBAUEBgUFBgkGBQYJCwgGBggLDAoKCwoKDBAMDAwMDAwQDA4PEA8ODBMTFBQTExwbGxscHx8fHx8fHx8fHwEHBwcNDA0YEBAYGhURFRofHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8f/8IAEQgBRAFEAwERAAIRAQMRAf/EANsAAQACAwEBAQAAAAAAAAAAAAACAwEEBQYHCAEBAQEBAQEAAAAAAAAAAAAAAAECAwQFEAABAwMDBAIBAgYDAQAAAAABAAIDEBEEQBIFIDAhMRMGIkEUUIAyIzM0FTUWJBEAAQIDAwkFBwMDBQAAAAAAAQACESEDEDFhIDBAQVFxEiITscEyUgTwgZGhQmIj0YIzUHJjorLCUxQSAQACAwAAAAAAAAAAAAAAAGFAoAAwYBMBAAIBAwIFBAMBAQEAAAAAAQARITFBURBhIEBxgaHwkbHBMNHh8VBw/9oADAMBAAIRAxEAAAH6oAAAAAAAAAAAAAAAAAAAAAAAAAAAAc2PELwCJI6x007x6GgAAAAAAAAAAAAAAOafL868oUWYImYlUIkdivYn0KzaAAAAAAAAAAAAAODL8Zl51lRisSZWZgkWRJYJ6VftusyAAAAAAAAAAAAOVHw5rmJCwZJSyBYYKwZMH25PVUAAAAAAAAAAAB8al8TZIgWS4SSyIFSZXCYJrFOpX6ANkAAAAAAAAAAA87Hw9aLMy5EuLJGCsgCcXzUbKLnFfWD6MAAAAAAAAAAAfK5fniW56JbJdjO7ZZRbnWxnUKrKrmFmn056XTjXqeuPuAAAAAAAAAAAB8Nl4Odd7h6pZ0zrexu6XMSllUEqqlKtSjWeF6PJo9eN5+jK2QAAAAAAAAADB+dpWOnd4em/nu7HTdNlGbCVTWaJdaqLmnU4nfy8rvwjZ99O+AAAAAAAAAAQPzxm2469vz+m7HTexrqaxNEsJqVlu8aWd6Gda9lGs8D0+XndeMbPstnswAAAAAAAAAAfn7OreXfq+f03Z1vS9C4lKEKwa66hA1rOF6fLzO3Gu5+2WepAAAAAAAAAAB8Ezrd8/q3eXaebtruySWUmFjQrNOFmvXK7ceT6PLrXP3PU7wAAAAAAAAAAPh2NbvD11Rg2o383exvYIkTX1Kk0lplVTZwvT5NDpz+6Wd0AAAAAAAAAA8ly7/L07vPtyrnfzazWN7n17fLpcnJ3nkdeVOsby0rLOt/G+J38/E68ff8An9f0n0eTc1kAAAAAAAAAeH8/r8VnXSTUmtDpw1N473PrXx9HTxvfzOLpnty5PbzVLs8u3X57wvC7+fb59Ony9Ht/X4vQ9eAAAAAAAAAA8rx9PguPffY1M7tN0qmtU6Od3RoMw0s1i1OfLuZubOZ35Xce27N+w9Xj9L284AAAAAAAAA4/Pp8y83v3bxu5ddqJLizkavUzuSasbbODISBrazrdcZ49sW/SPb8/qb5gAAAAAAAACuPl/k+hVJtcum/E7dOuXqdTO8JrSbpeYlwzqmv0xT0zHn02tT6d7PnToAAAAAAAAADh46eA83r2eW+lLYczTVrqTVcmsSOjEyLPPXX6c42X437X2ePudOQAAAAAAAAAAHmOfTyXk9vR56trlatO89GWUzq23xbjWanJzrNfee538/o98+105gAAAAAAAAAADlZ1868ft6HLpXVOrHUtubYxZjOrIpL83UuaNz2vq8fpunMAAAAAAAAAAACEfKvL7dnh10t5o3d+anNZQys5dm5i7fPWpvON49x6fL6HpzAAAAAAAAAAAAHiePfjeX1TmuL2b9x2by2WaJrl56xx02ucjZzN5bx7/wBHm73TmAAAAAAAAAAAAKJfmfk9t3HrrbWa3ualSySnGb8J5nJ3NTebY+h+ryd7pzAAAAAAAAAAAAA+Y+b1VcPRmW+sCtiSqJRq2cjczFy+69Xj9P15AAAAAAAAAAAAAfNfP6uZx7buN7FT1cZs2Y5U3PF3IS7ObXZvd+Psu/H0euQAAAAAAAAAAAFS/L/P6+Xx6bsvQz0uskmZKE4m5HOt3KC06le8aW+v0btw9b08WQAAAAAAAAAAcmb+d8vo8nnwu59Beb2NZKLmikuxmjBRZVqaHT12Xv1e3y/W9PD69MgAAAAAAAEDxp4i65PD6Usenbz4dnGrsWOl0bGRcFkSXCQqmzT100+vtsl5Pq+LX04dVn3eZ7uJAAAAAAHOPJ189t57VedbXL3bXL2WTy9Dnz6HPcoxZsSyMRMkV2VVravH6+1d0dfJzu3zZaxG5XPfk+k5ellyAAAAeWs+f7nnSmaTWGpZ3Znrvef6t0bXPw9HndvKFWxMRIFWpq63yOvs19anccb0/HaxG5zc4ZWTs7se+xfZS5AByk4Vec08LvMJYyzmi4msZ1mb6XD6Wc9dvOtzl5utz55QJckzX1dDp6NDp6IErnlen5OveMdYzc5uVkUWTstr1vO/VMa2jUPnmp47U0SisCWxbFpzqMuZrM6XZ7dXh9KMs5razNvPKecxqq7p1ui9MmVjrHM9Hy9e8caxVeeLmVmbMpWkqF+pt5e0zeNXJs5SwIwLbbFqzqqJzcpvOd5m9jHo3+fstz1yuYAyYMiynfDQ6+LXvHGsZuYXFN521iydmEqiyoxZqY1LopWObVFhdpOWqWmWU1mbxnVk6WZ6zz1sz12c9tqdZTWDBlIXMLirXPV1wq1yjrli4zcY1nWc50uck7IGDAqes2FcsM26sgjLCXEsZrOdbE67E73Y6wz0Tdues5ouVyEGLmnXKrXGvXHGsV65LjNxVc0M22LBbVEWEN5WbWdRNk14iFjLTmwltb3J12M9bc9Kc9as27Pec3KbzLNRGwkLivXOrXnjrnHXOm8o3OxvMbjTmZWSsGSVQLd4SzzbKFEZXBRm1Zu/d7c67E3DPSrO9aW3He3PaU3Oak1iFmSLMLivXOvfCvXKOucWKdc83N9zVc0JbZmhekKuJFJiImCa6ubmXbtxN7TeM9JZ6a2az12M9556zm8ylyZjFRuK7iGudeuFeuWNc8XFdxVcZSes1psalZMkbFkqkaWbhKpdizVlry3ta1c3qXepnV+ekZ0qzq/PW7HplNZm0s2sriTFkLmOudd5Q1zr3xjeeLiFxi5oYxZbZZZKiZNvTJk//9oACAEBAAEFAv4zl8jh4oyftj7v+ycq4/8ApOVsz7NyrFH9wmtH9wxCsbnuMyH6/Oz4MOHN+xZuQnSXRcV5V1cK5XimPzXIwDD+3ErHyYciLV8rysWDFlZc+RKSt4W9XQJp5CH5JovQrheWfiTtII1PJZ8eFjZeXLPKXK6sEPBsFZWKAK/Xct/i/j0vr+fFPhan7FyP7nMJJNqbWoIrfcOKDyFuRQobrByzFLjzRzQ6fnc39rgPcrIeKWrtpZWQCEaJtX6pyO9mn+3ZH/0m6bE4ot2rexDyhiucv2XluCwr/jo1/wAfGjgNX7QBHHcpIfycLFfWspsHI6fnpnS8nEy5YwW+Nqbjx3ZG0IMBXxBBqstoRatqITmrJj2m3iCT45MaVsuPpT4GS4vni9x+k1qEZsI7Lai1bUWpzUQiEVl+6cDL8nFaV/8ATIP7kTfLPQUaaLK68KyACsFInBEJyn9or6p/1mmyABkxNQCamIOV6WpdPRRCeFMPJHkr61Hs4rTZrduZEz8QrJjUGLaQrLyrFAJ4Ro5TMRanLgv+p03JR7eVtZGZrU2dNzI2pmdCUyVpXhGyLm2+WIJ00Dk6RqEwKKe3cJRtc5cGLcXpecznwrIMpynjx+3JcMaFo+HFRhYDA/amuuje0ripI7oQMTYXWkjkUTnXss7wRuc6DOzYGYk4nx9J9iZeTLZ+DgpH/G3GjflyZDfifiQGSBzBbGJT3eHgudFjb3coxsUmPjySNx8ol21ppyTfHG4d1M1cG4fsdJz8d4cn+gp8W9RY8YXxQWJYnnzALNl9W87WNPwxPJxYrHBbuayyssxm6LHkfGJDuZwTSMbScszdgz0YEIwV8TUQGj26L1LRrLj4WLYrEIoqRu4SABkf+LjWbcLSPYHslx3RTelGhTIP4sTPTkVDey2opyJp8B2wwumkY0NbpeUxPmiTEykz7prbKNrrOBRYoiWpppIn0Aub+OLw/hi0/M48Qx2JhV09jgTIQo8kWfPuW+QlkaNwmSNcnnw+nH4LMlY/FY8TtRyjN2CD5a7x8hXyko+U1rbeFtW9wQcU9B12ONOEH9vUvaHskYY5W/48lzmKOaMpskQXzRr5Yl8wRc8p+U/fjCW1rRuKHvhP9XVc3jbZYiip8aMqKVoTH4hax2MGuzImqfIfI6KJrUQpTZpKBXC/6WqnhZNEQYpnFH2GBFsG0Rxp8MS2WTfA/SSTc4lBcJ/pavkfx5AG4AQaiCm3pak8nhzkxtOBffG1fNi2fG5NPhtP1o9waJZVHGrUw8yTFkwebx8l+pkkZGzkc2LMyASEyVNoE6yc8KWYuMcaCNCnH+7xnMxvbp83k8XEHL8xJlRxgCOkeRtXztIMwRyLpxe5NYEBUoo/1AqDmsrDOF9lw53A30T3sY3M+0Ykay+f5KdRyFyd5EbrtC2rYmsC+ONbVtQCsrUIUhp+kr9ztpWLymfjLj/tEUha5rh3Z+QwsdZ32vHYMvPy8t3lWKgX6xgtcwpicE0K1LIBWRCKkIAe5NCmerkU3U43mcrCOF9gwMlA37XIc/jYyy+Y5HJUm1XpdXKYbPemHcGqM1FPHRLI1qkkKa26e8NDjc3u0Gt6YXK52IsH7NizEEEdE3K8fCpftOA1cl9klmiMhK3HrhdcEFpY+6jf5atqsvNXysan5Lii5Bqc7aHvLqXsegK63Lh+Zkw3Y+Vj5DFlZUONDnctk5KkGO0l9L0AoTUBNJaWkPBbZB6ZI4IZb1+8X7sr9zInSvKurFWTnWT5CTRyB6vSaVBkSwSf+tm+Lk+Tfn5Ms/43RqG0JqFejHEISgiytXyrK1Lp8lk+QnoKHupHRuoSnFeh7QCDaE0AqAgFZBNdZA1vS4Rci51nVtV3sGgQTggjS6erI/kdlug0ugEGoMW0CvnsFW8o1snDwOj2PR9q1P0bGXJrGNB6CV7TWJsaDVawc7yEOwaH1Q0aj5ThY1CcKWW1FbrM82NXOQBco4ENjUD+N05yumjsHqNA5HyjZ4b7VqNW1BqsvYJ8vkTWlHwnPUcTnncyNbnvLQ1g3kkkAFyaEPXaNfCsiE19kRuRXsCjU1tWenXuxHcnbkzbul3WbZC1nb7ssn7qC1kLW7Jp4qUbIXTLqO+19l+jf6v0p//aAAgBAgABBQL+Sy/RuW5blvW9bluV0DrDW9b9hurPebqz3hqz3hqz3hrLKy2q3VZWVqjUOKFLq6uro1Curq/Q2m7TPTek9QoRVqJo3SvQRpdX67q6vUI0ZpXaAdDf4KKjTkd8I0aNQUe9ZbdSUe6E3VmgVuq3QE3VuCNAeo9LdYR3W6w91usd3QVfVu74OpvoW6c6Iad2haNDZW6joAOxbRHtWVu9bSWVlZWVlboHetqrfyDf/9oACAEDAAEFAv5LAFau1bFsWxbFsW1bURrBWyt2nDVjvP1Y7ztWO8dWO8dUKXV1uV+m6urq9TqGBEUsrKysh0WVlbocrLYjpYk/tGoNXICknvSRpyFLK3XZWVqlAUk96RntDQCjvelv3zUnTtPfKFHHUNQ7xKLtSO+7VjsX6SnatprZbFY0DVs6nawGt6363axvddrG90hFmrAt3me5ItQG3QZt77BSYDTxej3mi9ZDc6aKjh3LK1qSu1DTYle1btAXQFqPfZHUxupa6LeuyEdXGyLr6oGyBvXavjXxr418a2joJsib6wIO7ReiUdUOgK/TdFHVhBDuGp1IqP4SO0dcP4MKCo7JR0H/2gAIAQICBj8Cs5k7/9oACAEDAgY/ArD7yjAMdv8A/9oACAEBAQY/Av6zGtUA+3X8ER6alLU5/wCi/kDcAFDqjfAKbg7eEOpQacQYLnovbumuBtXhdq4pf0A1Kh/tbrKLQehS2Nv+KiTE45F8DkBtOqYNuBmgPU0t7mfohVou4mHTPNWPgp96NWo/ieflusuyJqSksbNh1If9bpVG96BFxu0o1X33MbtKdVqnie7Lmo6lIrGyGqynT4/zMHM3XpXA0xpUZN36zkSU7rJrEZdOfAAZuF6bUpu42n6hpDy13DVqcrO/JlbLJipW/wDjdAcM2nWdIo0YeFsSd9swrlIK6C8S8SvV6vs2BStaHeGpyx2aRWLvoPA33W3K5XZxr/KVTqNue0HR6rze550KgYxgIHRjuTt5ybo539x0eqBcHnt0Kn9xJ0es3/Ic/G30/wDbo9Vn+S/fZjZNX5M3KTrIZNDdozKTHcHFOIXE8lxJHMUVMrncuUxWxX5F8F/IpVA5XKBtEEwdXhay5upMq7b9FoHegdhFhK5nQYnN5gQ6UNic7qQMeUP1qIkReLYKRgNbj3Ita7hhCXaU8sdNl2K4HqNgKa76yoIDynRab/K7tQ3g2zkr5qAbFQAhkeGSjeuWOICiLSgMFxJxx0WphNNtnlxWxXrbbBAreVTxEfjopYbnCCdSf9Oawy/yGJTabReg0XCWjcbR+VnzGScmGY6jh+V/yGkdVrAH8Qi4ZNyE1KahBTKiJ5L+JxaWwgQuI87hdHSamE7Y23KWRxN8Y+ajbUOMNKLTc4QTmG9phYDq1rxK9Xq9SaSv4ynMayYlFEvEELSdrjpY9QLnSdvUEYqMIHUQm8dMGF6mxsVJiAAuTg2TTr1q6agFC39x0t1N9zk6mfpMFG2Qs5LYo2/uOmVRjmYWRNj2+V3bpj8QDmom3jb+5u1dJ34q3lNx3HSi954WtvK6tLwjlnhmJKJyWnWm0vUGFS4P1HSOd0X6qYvXCBwMGpNFsHKRV62qeWT7hZI9RnkcgyqOg87fD8dDLnkNaLyVw+nHWdtuap1Okzysl80STE7UUMi5XKWXDWbcLPxVSB5TNqDPVt6bvOPCg5piDcRnvy1mtOyM1w+kb1H+Z0mqPqKhP26vgpWQsI1XjO4myA96j8VK2Dealrpm73IAu6VTyv8A1URmiyn+arsFw3lc9bpM8lOSjGO/KisRdm8diib7MbYZP4qkW+R0wgz1A6L9v0qImNuT+Su2Oy9QptfVOAh2rpU29KPinE5mCiFip5cz7lyyG1Y2nMzQp1Tx+mP+ncuOi8PbhY6tVMGj2guEHpUvKL/ejOJwUpZqWRylTAK8C8C1BTcfcpW4rbm5fBdWg806gXD0B1vNHl3wXloM8De/epZ6ebwzs8/7fJe3zXtOzVkzNkLt1vfoEBmu5X/uXcsMx3rDYsV37F25/YFLKlZ2L/csNS7lgu9d2Y9prDYsV/yzUc5E3KUztWGxdi7V2L2nmcV3rtG1dlnfbEXrFQzEbIDJlM2RPwV/vWGsLsK7lhtzPYu1djl3LFYZHE3xIPHvzBRyOZcvgwU1yKd67F9ywsx1rDVl4rDWuxe3yWOtfavuWFsk6N31ZMtiFn//2gAIAQEDAT8h/wDZtaXQZfslSoNXr7IgTtjXzA8h7qX1W/TiBsXdXwlSZjNih8TPGaDn7sEcmnnybXy5eCV1J631hlYbdWzuYP8AiYNM4VB3S42LltYpJZ594z0p2iw/dfNoSjSpzw8PnLdjfny7TmBNzTgbEDVzH1EUy8RhzKEqAy5EDlr3JSdoQxcIbciWM25sXs7kVqwFdnzWX79QkVplPY2PQl/+RPEU0g1NJc8czHH2e8LK1VftDQwLSdu8ulaCCaO2sL2Z2QVDKKmquwwPmmTbK0fqEQZ1ga19pSZ1IoX9ksYy2M5GpAICl1loS9AjlZM25aaZ5jrNGzu2XmHJHjc8w3ukPOo9CYq3dWFsad4nuheoVLuRUyanvD4iXOriN6MYuSyBVtIeA94953hqCF++PMAgyb4k+IUyv2OY72OYaIoa06TbkUKfCbgOI0Wxh1XNp8Y98RCFejHKaJfnQVR1AynSvMcbgGxNLc0kxFtQzLFXtBcRsEePHEA0jjHoD0QsoHmbkYTYftNFKHueWdjwXFhtFfePXBIEZioYaevT2IXlOEX0i10roI4YYYGQPQkdPLBTNVV9otbqF8zBhqDmDaVL0NCUvInrKpEwzPih7Z6KQYhWsSCB32YjjyyXh0mnJJFiTFBmPJCrHSJESwIzd0l8bPEwzDM56QZlq1fk/L1Vnd94IHmHaapxTalbEtUY7ss1lBNU2mU22+sC5rlcBX+ny9tK5Zb6o0VxDK1hd8srQe84Os3PpAzeJu0TWH3gGC4XRztFl4ZzNJ6xHW8TVHG/W/LJu021nYLl54GoueZftQyb6Ez0r1qP49rL4fpLIPojnEzIfFwHfvS9te80+Nrg8/GUVtbQjHeYABa7SwMwVmPFQUbdHJh8riHYfMDnflTFKl1lN5p3fTiVmjg5HevMWlKtIp6bQ6yOgye0qQDPWUtMcNlUre1oJTBKKt6j2m5vFoD9TJlTnX/ZphUYyLSCKLGy9jmEXrwkYHdPvnyqDbg+z/IVH6jDpL1OTiUFH0YiWo8mUc7zDaXlUznTHFJ9yUSw4cwqKh4BcxFTFGv3jNY4lM6KFy236MQmiQ9jyvLmv2spltpHNMzwCO3cftVEyTD1zROIJD3Ig6W7Q4KOsw+YRyTF7QO4j8wkTddIVfe77r8rrChe8LbVvubJAABmoszTCUUhubUumYqjFjMOYRgR5sl0bvGXaC23IJmPKqNjdZovIPby1reyFa7hDe9Y5onppLoNDBNlFC5po2lRh1ZxLDoKImMTDtClKpuDgQ5v2DzGjggUo8x5mCIqdgTX8eSIupW0ZV9iYIQ5WCZsWV6cNppmpqS2FrLgq9wE5IDu1zSe3mUKag+1lcajY1iGW/xLrxKaCVW6J2pa7NZZpm6htv5A0HDKbY9I1ntv9h5rXGC94NNIXtBa5WFiNcVzibcviAOqG/SI0lvSDvxjGELQtxLRHM2X2jMibQf3UydIebypr+NaPuSwd0Ag90dpkXqBmbCKXPeZgkW1UoAinB+ZihtWO00U9By8uUZ2OeqPB3Zp+bRCsq9OH2i8Wo3mppjR1lXsl7OSPBQ7rN04gtz6ynewepNGo8GWujR84+or/cmBlgXO5NnL9SpdEMrlf7NEhmDWeodAsc2V2HnLZ/wpf0CzLtgR2lhLTzL2jViLuRp01DmiaCUR4EvzQH/Fb6BGoNWW7lELIGu28q5vDPTWUNWK9mkAK4CV6e4MFEMdelgTQvMpa2R8vDB8vqGua39e8399Vu3v6Qk8dGzJNOY5hhCDMibC1tU1HRxASjo6TVNUzhGhBsMLNepuR4yqHNfp7wAI2OieS12qOg92Pr/rt6sXT6DXqgSiuVlZhp7TloXJcZuww2DGsXn3eunSpKf0E1aNCWFnQ1limjeWEo65372YYZsa/uNSCQzsgT1/m+3en7DMSofao9tWVSu2j2aCXWjRxNxmterKqrFbq/1mSCDx0RRO3UUgQy1vscx7+5McrGrELbZNnrCtfbLDbNcmHia6rV/JtMs12D20QAJY6J4Uvw1ZrwrTfRpFUtf+x1ZlyJ1dUOJid/8AkPpvNz2uKWn6g2QzJH/p0qxALxjqrdrCMWC5ztEc+wOIitlSMrQjs7bf7DCdedbm82jBgzv6wR3qUHf/AMTt7S4DY3p9dveCkEyDI+Bl2BGobfYuLcOYH3hLymYHFlBENVjtYmVtgR4n1cv2/Eo0v22g39TS+joaukCbEeI2zB9GmYM0/H3MwHrms4srViLmB3do1u5/7Kp/DBcfEdbl9E+8UO6ocPvHAao1e7+k7ieWnqanT5GfXYG6y5te9kd0qJLqaPvF0gt426D4jMwEH62l7y/raJOcOP6ndu5FVkbfSaunZyQJXxs06/ZjtfcxXQ+SbHuMJho95ZrKEE4L4TEn1GBno+jsSu3qfuHFzF0IkcZl3Lcvic/MDdSlaPZN52ZVzPue0JNusvy7oAh7Ve/WGV0tDpGWBPozDGnJzAa/THdXH3PWbVcMLdGZb0d0pCpqrV4mwiLX07x0/Pb0l8/P6n0P9w2R1SYlw6A01NoMzKy77ynXaVMtmLHWZXaLCNYoQo50lBbL/wCkvj7k+nb3mH9Rs+HiPk6kJ+1Szf8ACd6+0t4Z6GW8RJwB2zAzhTjSEoctD9mZY1NziI5XP4fSJo36LX0mGdPyTb8m7PfOzzBQSYI9GUWKyCswmmprIWS9IH5SFWkAIstjgB/cfoRH/Jp7cJvHWqzvt9ZUv2fpEzgp3594GOflD7tmZ/uVMwuV0f8AkV92u6NuQ0Nq7xONPkn0c+kWv75hp+HntPjv2l9N489NpcNDeaptKB0VFzgLTyTlLmXuVEidC1Qzn/sfHO7+5r4+nEplx919Zkc77SK+60d/eD7/ACh6R9XCVLmI/MX254jr3imG7QbPeOuljU2l736fpNF6fmDX75jv12gA/iZkmsSVEj+JeV26ZTR3uD7MHUb4ixXR6CEsNCC1fhoJZK37n0mszb9vvMD9faNntu/ufcdoK9j4h87d4VCX1+EV/ptFNbxtxY6f9IdQ+nrHRfvwek0fjlHHb8yrH3lhtNZY8dpuI4Zojs8YgsSZIGs3q1zUrrNETENalvYiMsYIG0tDpvNF66Gt5+JqhnT6cbPSaJ+RcZTOT0PSamM7v8ylM9m6ZXvxtUKPTrXRYuvzHY+nrFc7uzabM/kjWcY3/eb/AA4jh8nf2j9eZRpFktiM1EO6vDhmLj1irDExXMeYF59D9zvs6ErGk9lPWK3lPeYMdeOP4f2mfX3nD1tzc53lzU170+y+0y78vSFW/Z/kxfjn3mb/AOHt0hn33hMTExGN18Y6tTb+v5m7n4h+jWp/h6xv6bT0v8pb6/fRzxwOH3bT5WJlxrvUL/Sa0a7t/wDfiYqmnT//2gAIAQIDAT8h/wDav/6ZfivpcPOsX4Vm0t4enm1GXLy+q/CQi84Yx8If+FLH+B6nnLj/AAX4D/wCv4SOHmWPgS/DXgVQj8xRFfVeWlvCHVWR6lqWuDjyxR6aQrqehDox4Rc9NPldHUHr30eo+B3CKaoTR5XR0fIiDHlkro/zHobfL3EqPUPC+MJR5g48A8FR8BCF4A8zo6qldb8LDzwYOipUqVKmMfA0edB0L6sIvATR5t6wy5cuXF6hCXNHnNcfE9DovTT5zVHrXiXwR5suleNfAMHzLcYeqSpUqXL8R5tely5cuX4w6mpUqV5CvEY+K/CQPGVK/jOhXhGOjGP8IQOln8DFeOoEuX4z0SJ4yDqC4FfwX0fAD+RidX+F4QP47idIfzMr+GoeRvWv4Hw1KlSpUqBD+cldHzR/IeCv42P8n48vUx7T89Ho/wAh5G+tyul+QIdPx5A6MI/wH+In1/3p+Z+PCQ8f/9oACAEDAwE/If8A2qldalf+ZX/xuv4Kj55wl9L/AMIJTzYgSoHoqVK8LE87SHS5fgv/AMAIQ6Pgeh1fODDrUrwV4HzkdLly5f8AAwx80PAjwnwsw+YtlT4GnhGMeropg9ZaUqCmvK7oMQ6KsbqC9KldbNPAGVEIPKnmCzorq11OlR8U4PLy8BX8j1Md+VELF/wkfEOlBHy1D0P4zwl75hZ8Cv4WMUivmdcOly49K8F9GPnCx0YdK6NSku5Xga/N7UOiGL2jCmKw5dXozX5sfBEWy4St9WMqa/OaIeGvDXTX5zTD+Gut0TzQXNN0GX/FUEKZNPMNola94dRly+lePDfQTK8sYyPBXSv4LXRmU2j5QJUeelb6/wAgnEKKIE2SL0f5rl+H6vqCgVGn8SwIgQD3nKbT8R8F+Q+u0ICVKqIlTxiZzTSVKVxtUf4b/mITaQxKgxDHjLy0IC8OVc/jox/huXH+Ih0JjBf4bnHEfrToYx/kP4x9bQPr+oH1/cD7/mLouXLl9Keh+PxGM76T6Yx/jP4gg++5+4euOf1D6OYTP8GiJnvHTt+J9P8AI/Xfox/gf4iEDTnb/Zufv/kNO20378TRyQ+YeN+u0frvGq7fj1j8kvv7/qfH5j5TBl0h/wBbQ07cQ+duPeX/AL/kv7bf7B9/zPr0/gfmL7cx+jmOtfaP/e0fp56sfIfiF33n44hfvz+pt23N5c+XEK9uZ+fExjH/ALH6Y/RH5+J+PrSfn8+UxvpPz+pT22hf12lfaGn18w177z4eN+Y/G8/4mr6+Jnb35j9O8bh+I/X+/wAf/9oADAMBAAIRAxEAABCSSSSSSSSSSSSSSSSSSSSSSSSSSSSM0kNiSSSSSSSSSSSSSSQq0zn+2SSSSSSSSSSSSSRa4PITr6SSSSSSSSSSSSThUnLaCmeSSSSSSSSSSSSGmJ4bpteySSSSSSSSSSSPFVWgRPD2SSSSSSSSSSSTMtKZM7vOGSSSSSSSSSSSDG1Ru+eLvySSSSSSSSSSCzPQzysUu0SSSSSSSSSSSdv9UhC6lYSSSSSSSSSSSDLaETFClWGySSSSSSSSSSFjlj4wNiNmSSSSSSSSSSR+htquK+vkSSSSSSSSSSTWIgzKrmI6rSSSSSSSSSSE8ciBoOCh/CSSSSSSSSSSL/ISfqh11yySSSSSSSSSOddYpbckPNySSSSSSSSSTzV4UXmr0QfySSSSSSSSSS0k3icncPsSSSSSSSSSSSTjjEsGVYHySSSSSSSSSSSXh9P2gVyySSSSSSSSSSSRn/DPh3k6SSSSSSSSSSSSS2zokpsrSSSSSSSSSSSSSICNuGNFKSSSSSSSSSSSSScevb/vjSSSSSSSSSSSSSQemY+mWgySSSSSSSSSSSSD9A9xHCCySSSSSSSSSSTIkXJiiBWT6SSSSSSSSQMIK+TiEEXD2miSSSSSSYQtPPbqez4c3vBGSSCSBlxxPRrjl9v6bwVZZiSBkfFU/qhC/aRRY6QndDyDD2jHAyx+nGHvAo66LnHtu1+TQVF3T7J+4snHQNtkuOsrGTF34qQ30qti6rmkGySW01uJXtyH4HCG2Gkl0mv8vsHtf0de/DpfAI9sAtrfUtTtV6kalPWxkPj0u6Vs7b02dQQgsH04u1WGRIDXO/b14lu0DkFAS4cmj+Cf/9oACAEBAwE/EP8A2LhayV0qcZI9TWYUc7P3hxFKw7O2Ucp7oqn2I9cBbJq60wxA4EAiKatrqJIljtIacoGFTvs+xgvssAEtFiZEfP1v00xxGU53Ral3c57EV61WW+rbGXgXvcEUKrujYEt3MQDQGzpNX60/sgATN+8t7qHeC93DqHVW32RRoqkhv6eGH1PlA1DUNx84/SRloo8OQfMttFV0WY0oQDYvvuwmCnK4VdabwfI08xegXfeYhs2TUiV1exqd5f0BymjUHCpdDfuczJG61f8AY+5amy9o2NcDg0OD/KV9mTcLHzVT286WPsGrEcna4NgNg0IGFryYERhScLKO3sxMS1ySgAteHHeIosC4NT/UuKvsGK8Ajb+ppOZSmIWNQWzXM1cIruJlhDW5S9oBMUxL31TR6F6lceatVNJX8rzhFAyWYpuoNR+yXseXeaSWs/0YqMQ9w7MxKa+QmEID1GjMca0HZIxS5bTFwHEWBhcvrMw7xtUGtRMjpxF/WIkIejSAnyowjDfD5g8Puj7S7u0rJW5Uyt5hsFp3YzLhDdYwtz3x7zMdlaBYSm2uEwDf5kNty3a+0AXX2Y7qa/MO+JvMcXDhgpbTBmte6K9VvMuqth1gScNYq4uzXmG5cpm1B6EFVyuvaNquFTMZtdC7O825b0bxgUNqqK22WstszhPNQDuxsrkEtftFWXtA8j2ekHdyb2Gdjs8RYHhVsrh2tTtjKps0dpguwuaie2cMPLr8JtgKi++8DWd3iVRTSiPtJ3DMHQJqaJRDPaXuo2rEsmAPZ7xXAPaW5azeCNYalo1pzKzT3YJD0q8StMuS8RVhqQ7haH1XGTW48uDC+W7rn2FzkYQi3msFrttiXndlut6jwBg3l0Azggs17IZNmNCZeUd19oNELpsGEVFPpki1WtacwBVZIo0zFrjXtC2la6QovtKE30CrIt6eWd6gV3VUHnHwcjuYIxTqRBxXeJ+kvoGVhpnUqSH2Qo3i+CS7dTTRk09Y1VRW7RIQuxhTfvDwj3uZTVc/3DXWsf00+sQsmqPvDEOYS2bnV0F6+WIORCJ2ZWBbpogppyrb9tY6AxW0qqmIQl1W8obWbwtr7RC2EaW4eO0ygZIgUZYrMh+YkYYM6oKm8zMO2KiNDTT1It6KVGPr+ZkgSE0zQr7eWZeqwOy7bpKHXg1NOlHMKi4Smq+dIaKa9MRqGVy5slFjWLGjTeWCuHEXYA76y5yPbtA5jLS2p+5UJeHePZgLAiUliW51qUGVk1eI9CBY763lt5QI2OFs/tUIwUGDA2aBLODdWDEUTW9wacxYoaANPvEcBvRuFiuckoR3PWEzpW8ri7aD4mQQ4sSOJqKhiKtb3lWoLUPR6ko1lqsV12ulgfJml7i0Tt5Z4G1oZsBocwYIA+APdCAtnThiZILRsnapbTL1yOclsYN2Zc8bEf1HZ003Q1drDdzfs1LTSbLuOcxdf6IDdtWxp9oAFksDPs3cVyXvYftUr2FhOjFC09IjAn+IrVgA7tR11YwBupk9YYANQyBsHazyusIzfQP7jngEX6gqKnn/ACCDAl8EvLW3Hg2gI7kxQ1Q32Qkii4OWitXeBSXvCPKIHXqVnMcOxpprNDF23FLM5lRqP5QaJiOS7D+20xfwq/fMprEqlgdFH9JaLLWzTtBnP1U0hljBILk0b0XEUsXvUwZqx2AfzDybpC4wj7YPmHGZcDgix4US+5h2SjUnO3xGjaVutHdlWywWkJATHM95ajCawIA4xccu5WNY6UjZbUSyLVjt9bqoiGRQ+srWbhfU1hcUhtDDmaEWh+Y4O1lamUCtsdyEpXqwN/mHk2VQMHrXFfxGhcsPQjMRZsPxAzq02loB6kdQ9JgEKDAEBNefzAQAqjY7SgUQ+BUpN2XC+5ogjRuLma/DgZ/0PUlhxwCXrixp2jAZR61G6egOxvDoqQPdPw8ow/LIewqZOyVT+jJEapgMLKsMJSj3lti9pegy3pLLvnNwIVeC72ZjQFuhmBheJYgQ9xmtZppKGxfaJpQfWDtHSaLcl4DhavLpFolaTYSlIMjj8eIHNHPYUeWCsy0uT3eSJAqy2m5Ha9sd5ZN76wunQJqZ+8TBRvGLA2hVA1o3F2tGbipaHyQO9xAJqMAqmsdn7ghRhdO8y44RWbJgUBOrVp2vVh5aohpUJsAiNcwivuQAU5ZfCgIkwou1kQMm5L+JhDU4ZlKBHAJbaJOR9iGps5DQlZhGS5TtMokSkwjwkHAXEu0L45hWAwLSm7MOkSdy6lxuHF+vmdNRntP4iBUQvQC/VK6xovogQc0wVKt4YZUG6z4l0aoyVjSDX04alxoDXEebd8wMMzeoHc4lf4G/8iZvMPs2gG+flP781nP9ABUoKHnlV8kqJkGvEfqVUWFpiUbkbmn7MUELgSIvH23hOTZQfmY0TgTJxUxGWmlHNsUx/ILcEXdQoeWnlD/Zmam2nZWGrfmMRe2X0JpbKl9APNMXRvqMBZIFeZZIbAq2OYWOGhAZGEIHDAucGUJQEKl21mpnxRYOvczT8CKY0XRAyWgGoNfQlIhdVKbWNIxjeCWBRQQwXdcSq/8Awmp5T5PN2eETutjuszjTOdlX7xhwsI7MGTlMMUbr6TdI6LYpLhutXEMBq7FU7xcF2bS0dhk7wp3SaXEja/glpGrLVneK+3+Q84bjBX9hhna9cR0ZEIqkFaQijzvswMAYZNarpLLyy4havA3CZWXWb+vQ7xDcevaXmpXJZyZoI/EHzdCYoPev6hkHWqYTS9GWjJjPtHKwO5vRCVgBdIhm3tASt3sRwnP3Rny6Rxc1p6s7QhjGxFp0gnNZik7PpqMv/uo4DogA3ww8wxARGaBAlSHEtujbWE0yMbT4B4eY1DvAZat4fCNSt3febMgs7x2AWXmZNIFDFvUd2bKWSzMMuhIgrDjCGp9mUyIbeYL/APSAgjY6O0PLXMr40K5Lo94w+dd2+BdB2EBmgs91yrBv9RErTucxxaNuoJ66VXL9YrQSXEINGUIqx2v5mySg1iIje0NK9XXtAlob7KlNlPsGr94QHbeUW0Lw4XKemIOCDg50o1l2QKxrRYjuJ5G4Oc7EMcoELA9DYZ1v8BNQSG/Pc+czCkd9QtrEo5UT3ls7BO5hl1c8R7zI69mNK4e/EtjeatRRQ30zHwGOAqAIpntKDBHdrvGm0V7Su+YDvg1+4xQU2AlklBadgiNLqQDVd4apbtjUipZK2Bs317VKMDC5HTe9XJCY2JCmiDD478ZjUN3yF8JeTwsd6fDxEDm2LTmyiVwLxNX3iy6BqmafTeMDKH2a/cAGC8XNC5u9dE3BpCaSh4dGCbdGnb0gDhEc04l0ot9YqbKayxbhqjiBoUdiXG2YHfSZb2jvWcbi4JaF3mpscHpGydZcrIWWqXTG8Andh8WcCZrKdQOOcsXKG3N7MUo1GqyMs7fz1OXIv0xLZcXEr28/eoFA1qsR3E8IBEsdTwKGvvFdHRPsj7WhG+XCuB/NHQH26V99YFXRsN2UqrN8xg1xjP6RTV2ExppGAou3ypioaOpHY1nT+PeX5SkwmowEBfeOF13hNxxKVlPTSYwFfmYNy+IeCjTOLiDf7S7XSDhXd8+vBF6XpDQcEznywzgWPWt2CxWza7RY4yFWy2Ri7K0Ogd5dWzO9795gp9o+iA4jPNG45I3YPdodk37kVJSsbzHfIq5ioB0RNTwaNa7xCx0HvNTKiDROgz6g/EJeQnse3cVLY7gzRFLgN3WH0u4q5MGhxDQrLlTb1JQNq9g595ZwOWO47QAdTlqDvMvwu4k0Cg5IBZ3OfWATK77PvLQu5rC73Ok2LfFzBqwqG4286xF3anpCB+Al+F2uv9DaIqp1DlfeWOWyF7H7eCCa01rpg1OEuDec0mvtGNXZ0Zb0qUQTOpbfxApqps95y1rqRqvJTWY8a7jKnFvG00C42P8AZEoXQ2t2uOfshFI1Eq41D1OleB6GX43IaEAVDil23n2MREXlEUfVCDhOLvOe8vUwcpyxWg1zAOhQ+YpkoKv0iIMm4c53jaDJsHd8y7erv/cFnfnf3RNbDoaj/UFuAb/azzvL0Y3Gpf6i2JKDa2Z9akbMBBDcVQAhB3pqM1D0Z7d+qlsO3NV+0okMeWX7sE2sEMyprcyy9UcvYjDA3xPcmoIUUBhtx5is5ZL07/pAAM1o7Y1gOw773tLq8Z3Ce54mSu0KqY5gO/1gSji87EjDgNz0fSO4YokP2QeGfcjejWh6sokWbxg1Pf4IwjFLyo2aMrq8RVg051lq1pBLG1dohiffeCCZ9Blub8xavbdNfSoABdMYmDfJuxQoNqs09SfiWA5XuHs/qA6wPsfhCjS3pPrxBAlN5KyQdYwyzvEcme0tGtDM9Up1bIhgIgoewy/EpUgV9bDX0lyK0i4B45RWl0+xO4juo4bRQ+ia1bZv6v8ASGjQXqb27hLJad9KlYaYwO0aYjHVIzsd6iXt9MxRWGuI41nG/EcEx02PeYsuVyoH/sc1e9y90JanTckYUFEvG0EqIVvKasaqF/mBYX3NTtGoN9j09IJcK2ch9pU4ovf8Ys0YNUZ9kCNmkz+4gS6PslCFBkCii67VCFvats44ZaZBe4c+0EtxJem02exiKl+60JRFm9t+mI8qMI4W7gZigw3YXtrRWsUaWj5veIQWDV0NMN2Bk5VdhsI2HLlcprg4iIsa1d6lnaN7WWieippyFpNUl13TvrFd8ywZae8QE3dJUaAreZ+u1S8UxpUyo+89nG3VtiNogy3KuWGolCbDMAwZ9YoURwfESkN8ekAt/sThc7MXbVBrw9SZ1m1hs9lRQLjOyxAKrG6aPZAtoGSq70JsWm+z07EA1ql0aHZnJ1d2/pDEooIGi0NjMGq79bjnSHsQTgKq+CM1uhrRtNaiRVImI1LriOhj1BHLmDVq76vsBMFaR3OXLUT74aWocaSyKU1vy7IujZWwGcto6IpGA41jlHXSN2faJQ5ZYzoxGAK3gO8MkaCjHeWJa5YSaNCzWJKVW+0YHrLtHZbecQsI1C4GEFIXwMK3N1uRrMntKRFllpgeku4Z1wG80rMjU1jMgllFtWTiGaAr6dz3ZRzbuAP4ESxXb2DghAoob4Y9WVdN27QGmjtD5RBQby6ZWnfeLNXiKGz6waWx3LRHEdegZxYrQmEhGvWdxLrsdp1N40QK9zsaCVM1bLsu+tkRZEuuXKyCAe+4ZO8GDU03XzHbc17JBAJowE771HlvvKy7UqpSDSs13gabN5EgWfeVz9iJdbhELZSHTMKRGggDTrAvOyYjA27ww1Jjg18scR7q06SxlODYKmSCrNk1uFomirsOHM6b4fe5AC8c8Od8S9K1vzekANL1MmdaEDg3ar0d4BitONCINblXBg2h3l260zRVt6DW7lysIOeHPrMzl2ehQRNrwuNg57Sjg4MTQt0l3Sv93WCls22plLiqiNGi6XI7PaE7DVlBzje49GgdlE0ZWZG9cEvyhrPMuN088yzY0Zibat7wlazkpjvAcYhCLEIs0ZomLAqNUjUuAJdTNUdiJQvVKHD6zuiGwrXE0FnKcAcxBRTdY0PpFjq75wrTSUFs5o23WrELINZwA0TFEOjf0u4SoPQBy7xFRy6T1whFX91xA0IEx3Gr3hBdU5d77RQdK7ELdrWGXrK598yx/DxNZntrKVtN44XDOpyhL0AHEOSUCuDlNXaIUaJxa2EZQYRWO3WnvAk5tQmh7Js5F0rKV3la04uzjssSq8ZwaTOPNMNcQEFKj7P9xBkXWENUWOtQhLQcTQaJhrEYdyobpqoZulPrbaEpno0qb+9detz/AL00mX5XMrDtWkwN3MbO7LmBsNyMXUvTWnvPTfReh+Zn71zvQmTBi74txu7rnjsdel+reaxeuvdJ2cOeEYPebrvvNumHKq7SlN3W3NwxxpOybP3Nbele2s23+G8r69hMRet6NK+m813rDN7ri1Fc/wC5HFvljOQ1/HCYrmF91bTIXemOK/aZnX6ZhZ3eL5mTef0N5iV9GtzD/XTDv7tZbDp/vacNoOdeMPpj3qZ9vfSp/9oACAECAwE/EP8A2b6Lly5cv/wViyv4b86vSpXSv4NPNsqV/FUroeaYeEiQ8FecYHS4spL6XLlnQsZFw809DIX0iMUNWJIyvUB9GmWEd+aJQRXFEYLZct0D1uKJJaS4+YJp6H0BEiROhUroMIMQ81p6S6EuMqEx4DmBCHmcEUely+ldS+C8Q0hDy7HHpXQkrpUrwDo6PM6Oi7GbQUca+A7YyKLhCqWEPLrgStmDmNZZp0eaZdHorluI32huQkegBNppLg+V1EzJFUq4BCyuUiVBGYQyrEUqzLhFmNQQY78rFhjpjzKY8pSN4FReAxi5eo2jlTHaih+flRcjnpWXKhCMSPRZcuHRdEzdwSg+VSyo6zFsi6XBgRZfQelSoMMdEJokCjy3qEKCMPgGVM9B0IkCGaYGUvMFB6DFAuIyllJSV0ejXCOfNQYOIkIHCL0NRCJK6uqaPNJZBlgzLGKl5frhZTUxl4jDSHXzhkuDMVRIC4p1CorLgXAmBNPzYsqZGBKITSViOiypRBHKaPnBogz0uDFJcXQQOgRaPOgxGEB0egQOqSqG+aUIDLjFxYRIEAPAEoiViA4dfMNJe1HGDOGX6gDSMX0IS5p6JYnlKlTXDHQsYJZVLQSXL6kuem9Sscwhh/nVCKjiJmHeXiLEEYMuXL6rh0FvQWXZnpM9W8Wfxowlp1WP0SyO0HgCPidlcWpchsQ+IY6jKvoLPFXRz9DCyo9GMy2TXo1xgx6mYj0QqXHUAYhCEIRgwhB6SdAuUQgeCuixjGC9Y4y4wGJ64YAldLirBDEIdCEPBcylvRXKhGX0rosejFiw3Gb8dwU5oUQnxB+8IQhDodCDLh0rNYRXRYxxGOYq1j0uJcYtLS0t0hEQhpW0OPiEPph1IdE6MF9BM45gdWPS+iS9/mVtXtF3jLly5cuW9CENIa19PQSrx94ZjDw10HS5UAR6sWXKlY/P+RND7f7FbvffiU9uZ9jGtIx8NQgwM94YOPlOzpxKvX6Jr+pfOnRxCVK6MIS89L6vRZVwtpFpdQ2vweO0d/n/ACf8f7G9fvPu/UfGQ7w7w+njtEGT3/yAmPpnrpxLfrSDCaw8BK8LARjBaYNNY22uLnXPMspxjjf1jxub7RY8xn48ZCYfX5nyht+YVr/qF6b/AKgHt0GujnSGYdCB1I9VpS8zshC9tZiu0zitd+ajV/TMz7zd+ePad0bvv4yE3Q0INX6+0L2nG3/U+v8AvT1mZq6HoR6//9oACAEDAwE/EP8A2a6lSupX/gBAIv8AETzgXLlxZcuX4a6a+bCMuX1JXgvrdR80YJfWvAy+lQejL8yEWBKlS0elSpUqVCcPNmnRGK1QHEBdCWa9IJWViImMVsq81UsZRAus4UB1CE6MroBlDKh5hmroMI9C4MXouMSMWfN5oPBVCXEy3puPQLYx8wTNBA6NujMzK6A66YMxMx1j5czKiDDoM0ZcJcWDGX1eqMfL5MWIk6aQWXxMzM0lEIrAMuG5U9Hyw3XaZo0jpC8RCdZci1LlpfKwd3QbqbCHrpfeWRZQXNDpGJW8A1qQyTI6UiqNrS5bol2uvQ6BWMNyryupnbqFtDhLTGVcNOhjboE0lRgsmJBpjvyqgRMJBtA6LlW9AxCEWEqJ1Jc0wZlx5VU2QRErNwl9COsI9AhHwM2XUOxitvy2uaRTEcYRahLCKMGL4C9BzHE0bTzC7oowJlESWRQg7xYRIY6NEVx5r1QjgysJV9G0MQYsKMYJpmvzQ0y4MIKiJUrElG8Q3htHUx+cMdo7IJAqYAtQUZ6FB3RSqOilzJmr5uhuWBL6VwdzHsiVmLGkuLowJq+c0GPpU0iPQEejCGHzjKVmEcdGMYsuEVGHACzJ5p0AWxFZzvK6DaXFlxZVyurHKe3qWOfh5hKhDVZr9pqhE6ikYWgeBgZlFmrKhqtWNPKVAKWBhBYRKYEqMB0V0CV0Yz0SVmiUC2XwbGmIExGPkQ9pf9a+kN0yjmVTHmIErpXjZpC3CfelBiHfscxBtyccyjTH6gH0jLl/xvQGBA9H8Qz9Z9u0t1vOhs9P7jjVfr2h4jzSMqf4WOUGOZUjWc83ArQiy5575957LPkZms3+kH3/AD36rUIHxXLiyoECH12m3L9aQ1vn+oNPEDFfG0uPU+tYvIhGdY32lX1qVKmiE3IAFGk5yzpEVy/Xe5hrvvNHGPmNbbxSPRlQh4C+Ih9d/WFUfVS58Pj3hbr/AJHfL49pct41bIm82+FuqPIQ5oO7NohRoSrlQBpcvi/gjiKIfQdmKlw9z9w1gbhWkWPgqJDoqX4SHaEC4LL2+YKL+dvchR2v7S1VXt/TGrmvuTIMAcypnrUrokhBWa6cf9mcv+lw8xYbMb9nkn14TkOYr3ez/faZH5/uXF21rfx1Kj4hPz+ZrAxHUfkg1n5JS8fTWYtPaAEd9u0J6KHB4/EOUpKSnTRe0Voe27OF3x/rM8bNQ0XPeXu3PN6J27wFDeui/ipo2/ZH+o3TZl0c9ziG7znZ57Q56X4llxJh0uX0IQIK/wCQWWSim6Nk37VFyVfsSAY9iV70zX+krV5T59u0DdrtxAIEqVK7RYu907P6mFG6dt4+GEbbV3lcuWvLgmpvjN6veFWXHd1H9z0s4XV7SmbP8YNnXo+Jdb8JCBXEBV7fPtHvI+CElH1uSBN7luvDBdRjrsO53lGzaPv79pa88M8wfbiHMIdGOtbxlLtDbxr+EK0ZaBujNqr1OK/uOVnocKBj1d3J2jxbjnde5FyG+3f17x42jHwvjOhNPaFFHoNf+Ro6/ocesqLFPXcvJEqF2fajcwA4vAyitrdtBg7Qen+w+ZcvqpXaFvnhtUDn9DHjSl1/JDgH9PRjUe3s7iNGxy/Y4mnJV92LRTpL7/RFHxV4DodAhWb9HPvNZdZW7ekDC05erTX0isZ7OyoKsInvDz6RSluTR2Dj1hbSu79oaFrb3enpAV+hX9wCu3hUWFm34/2Xy6v2HpNI3jbe9pXNmHUa+stYanTs794pl93I/pE202f2jnT/AJHjaMf4noRhNsa3mOT3a9ZnF/29XaZs1h6L7d5o16vp2mTFfj7d5WvxzF7VWB2e0pRW7ENe8IdGM1fCUt7X3S1d7+jKX9N9I0c/g7yn34jJ9cSm1/lc2XHp0ej4v//Z',
            width: 150,
            height: 150
          },
        {
          table: {
            body: [
              [
                { text: 'col 1' , colSpan: 3},
                {},
                {}
              ],
              [
                { text: 'campo 1', rowSpan: 3 },
                'campo 2',
                'campo 3',
              ],
              [
                {},
                'campo 5',
                'campo 6',
              ],
              [
                {},
                'campo 8',
                'campo 9',
              ],
           
            ]
          }
        }
      ]
    }
  

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();



  }

  

  // generatePdf(){
  //   const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  //   pdfDocGenerator.getDataUrl((dataUrl) => {
  //     const targetElement = document.querySelector('#iframeContainer');
  //     const iframe = document.createElement('iframe');
  //     iframe.src = dataUrl;
  //     targetElement.appendChild(iframe);
  //   });
  // }

  // @ViewChild('pdfTable')
  // pdfTable!: ElementRef;

  // public downloadAsPDF() {
  //   const pdfTable = this.pdfTable.nativeElement;
  //   var html = htmlToPdfmake(pdfTable.innerHTML);
  //   const documentDefinition = { content: html };
  //   pdfMake.createPdf(documentDefinition).download();

  // }


load(){
  this.servicePlayer.get(this.limit).subscribe((players) => {
    this.players = players.data;
    // this.players = players.data.filter(
    //   (player) => this.playersSelected.findIndex((t) => t.id == player.id) == -1
    // );
     this.playersOriginal = players.data;
  });


  //Cualquier cambio que suceda se vea reflejado
  this.form.valueChanges.subscribe(valores => {
    if (!valores) return;
    this.players = this.playersOriginal;
    this.findPlayers(valores);

    // console.log(valores);
  });

}


findPlayers(valores: any) {
  debugger
  if (valores.first_name) {
    this.players = this.players.filter(
      (t) => t.first_name.indexOf(valores.first_name) !== -1
    );
  }
}

// generatePdf(){
//   const documentDefinition = { content: 'This is for testing.' };
//   pdfmake.createPdf(documentDefinition).open();
// }

drop($event: CdkDragDrop<Player[]>) {
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
    )

   if(this.playersSelected.length >3){

    this.status = false;
    console.log("mayor a 3"+this.status);

   }
   if(this.playersSelected.length <=3){

    this.status = true;
    console.log("menor a 3"+this.status);
   }

    console.log(this.playersSelected.length)

}

  noReturnPredicate() {

    if(typeof this.status=="undefined")
    {
      this.status = true;
      console.log("entro");
    }
    // if(this.playersSelected.length > 0){
    //   this.status = true;
    // }
   return this.status;

  }

AddPlayersActive(){


  this.playersSelected.forEach(element => {

    this.servicePlayer.edit(element.id,element).subscribe((resp: Player) => {//debe recibir un arreglo

      console.log(resp)
     });

  });


}


deleteItem(id: number) {
  debugger
  this.playersSelected = this.playersSelected.filter((i) => i.id !== id);

 // this.AddLocalStorage();
  this.load();

}

search(name: number) {
  this.servicePlayer.search(name).subscribe((player: Player) => {
    this.player = player;

  });

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
     // def_img: 0,
      isSelected: false,
      player_number: 0,
      image:'',
      status:'',
      curp:'',
      extension:'',

    }
  }


}
