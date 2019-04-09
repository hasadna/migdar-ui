import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.less']
})
export class SearchFiltersComponent implements OnInit {

  @Input() disableSorting: boolean;
  @Input() fixItemKind: boolean;
  @Input() itemKind: string;
  @Input() sortOrder: string;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.sortOrder = this.sortOrder || 'relevance';
    this.itemKind = this.itemKind || 'all';
    this.refresh();
  }

  refresh() {
    const types = {
      all: 'all',
      publications: 'publications',
      stats: 'datasets',
      datasets: 'datasets',
      organisations: 'orgs',
      'gender-index': 'datasets',
    }[this.itemKind];
    let filters = {};
    filters = Object.assign(filters,
      {
        stats: {kind: 'Gender Statistics'},
        'gender-index': {kind: 'Gender Index'},
      }[this.itemKind] || {}
    );
    this.api.searchParams(types, filters);
  }
}
