import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { Event } from 'src/shared/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  events: Event[];
  error:boolean;

  constructor(public service: UserService, private router: Router) {
    this.error = false;
    this.events = [];
  }

  ngOnInit(): void {
    this.error = true;
    // this.service.list().subscribe(events => {
    //   this.events = events.data;
    //   console.log(this.events);
    // });
  }

}
