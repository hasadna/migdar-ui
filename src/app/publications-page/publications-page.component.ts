import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { SearchManager } from '../search-manager';
import { HeaderStateService } from '../header-state.service';

@Component({
  selector: 'app-publications-page',
  templateUrl: './publications-page.component.html',
  styleUrls: ['./publications-page.component.less']
})
export class PublicationsPageComponent implements OnInit, OnDestroy {

  search: SearchManager;

  constructor(public api: ApiService, private header: HeaderStateService) {
    this.search = new SearchManager(api);
    this.search.search(null, 'publications');
  }

  ngOnInit() {
    this.header.section = 'publications';
  }

  ngOnDestroy() {
    this.header.clear();
  }

}
