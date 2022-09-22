import { Component, OnInit } from '@angular/core';
//import {testService  } from 'src/services/test.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.scss']
})
export class HomeAdminComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
