import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-organisations-page-header',
  templateUrl: './organisations-page-header.component.html',
  styleUrls: ['./organisations-page-header.component.less']
})
export class OrganisationsPageHeaderComponent implements OnInit {

  phase = 0;
  constructor(public api: ApiService) { }

  ngOnInit() {
    window.setInterval(() => {
      this.phase += 1;
      console.log(this.phase);
    }, 5000);
  }

}
