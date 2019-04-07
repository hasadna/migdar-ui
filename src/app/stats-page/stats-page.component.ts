import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { HeaderStateService } from '../header-state.service';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats-page.component.html',
  styleUrls: ['./stats-page.component.less']
})
export class StatsPageComponent implements OnInit, OnDestroy {

  constructor(public api: ApiService, private header: HeaderStateService) { }

  ngOnInit() {
    this.api.search(null, 'datasets');
    this.header.section = 'stats';
  }

  ngOnDestroy() {
    this.header.clear();
  }

}
