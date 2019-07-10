import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { SearchManager } from '../search-manager';

@Component({
  selector: 'app-item-page-publication',
  templateUrl: './item-page-publication.component.html',
  styleUrls: ['./item-page-publication.component.less']
})
export class ItemPagePublicationComponent implements OnInit {

  @Input() document: any;
  search: SearchManager;

  constructor(private api: ApiService) {
    this.search = new SearchManager(api);
  }

  ngOnInit() {
    this.search.search(this.document['life_areas'].join(' ')); // TODO filter by life areas
  }

}
