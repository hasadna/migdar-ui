import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { SearchManager } from '../search-manager';

@Component({
  selector: 'app-publications-page',
  templateUrl: './publications-page.component.html',
  styleUrls: ['./publications-page.component.less']
})
export class PublicationsPageComponent implements OnInit {

  search: SearchManager;

  constructor(public api: ApiService) {
    this.search = new SearchManager(api);
    this.search.search(null, 'publications');
  }

  ngOnInit() {
  }

}
