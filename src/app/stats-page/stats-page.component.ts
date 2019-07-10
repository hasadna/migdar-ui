import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { HeaderStateService } from '../header-state.service';
import { SearchManager } from '../search-manager';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats-page.component.html',
  styleUrls: ['./stats-page.component.less']
})
export class StatsPageComponent implements OnInit, OnDestroy {

  search: SearchManager;

  constructor(public api: ApiService, private header: HeaderStateService) {
    this.search = new SearchManager(api);
    this.search.search(null, 'datasets');
  }

  ngOnInit() {
    this.header.section = 'stats';
  }

  ngOnDestroy() {
    this.header.clear();
  }

}
