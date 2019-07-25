import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ApiService } from '../api.service';
import { SearchManager } from '../search-manager';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-item-page-stats',
  templateUrl: './item-page-stats.component.html',
  styleUrls: ['./item-page-stats.component.less']
})
export class ItemPageStatsComponent implements OnInit, OnChanges {

  @Input() document: any;
  search: SearchManager;

  data_sources = [];

  constructor(private api: ApiService, public _: I18nService) {
    this.search = new SearchManager(api);
  }

  ngOnInit() {
    this.refresh();
  }

  ngOnChanges() {
    this.refresh();
  }

  refresh() {
    this.data_sources = [];
    this.search = new SearchManager(this.api);
    this.search.search(
      null,
      'datasets',
      {
        life_areas: this.document['life_areas'],
        tags: this.document['tags'],
        doc_id__not: this.document['doc_id'],
      }
    );
  }

}
