import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-organisations-page',
  templateUrl: './organisations-page.component.html',
  styleUrls: ['./organisations-page.component.less']
})
export class OrganisationsPageComponent implements OnInit {

  constructor(public api: ApiService) { }

  ngOnInit() {
    this.api.search(null);
  }

}
