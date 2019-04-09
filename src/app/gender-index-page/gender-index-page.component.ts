import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gender-index-page',
  templateUrl: './gender-index-page.component.html',
  styleUrls: ['./gender-index-page.component.less']
})
export class GenderIndexPageComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

}
