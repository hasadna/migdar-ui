import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { HeaderStateService } from '../header-state.service';
import { SearchManager } from '../search-manager';

@Component({
  selector: 'app-organisations-page',
  templateUrl: './organisations-page.component.html',
  styleUrls: ['./organisations-page.component.less']
})
export class OrganisationsPageComponent implements OnInit, OnDestroy {

  search: SearchManager;

  constructor(public api: ApiService, private header: HeaderStateService) {
    this.search = new SearchManager(this.api);
  }

  ngOnInit() {
    this.header.section = 'orgs';
    this.search.search(null, 'orgs', {}, 'title_kw');
  }

  ngOnDestroy() {
    this.header.clear();
  }

}
