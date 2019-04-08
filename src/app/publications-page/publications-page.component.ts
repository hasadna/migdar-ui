import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-publications-page',
  templateUrl: './publications-page.component.html',
  styleUrls: ['./publications-page.component.less']
})
export class PublicationsPageComponent implements OnInit {

  constructor(public api: ApiService) { }

  ngOnInit() {
  }

}