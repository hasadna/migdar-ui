import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { HeaderStateService } from '../header-state.service';

@Component({
  selector: 'app-organisations-page',
  templateUrl: './organisations-page.component.html',
  styleUrls: ['./organisations-page.component.less']
})
export class OrganisationsPageComponent implements OnInit, OnDestroy {

  constructor(public api: ApiService, private header: HeaderStateService) { }

  ngOnInit() {
    this.header.section = 'organisations';
  }

  ngOnDestroy() {
    this.header.clear();
  }
}
