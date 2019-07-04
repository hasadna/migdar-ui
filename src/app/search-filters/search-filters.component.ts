import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { FilterManagerService } from '../filter-manager.service';
import { Router, ActivatedRoute } from '@angular/router';

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

  constructor(private api: ApiService,
              public filters: FilterManagerService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.sortOrder = this.sortOrder || 'relevance';
    this.itemKind = this.itemKind || 'all';
    this.refresh();
    this.filters.updated.subscribe((filters) => {
      console.log('FILTERS', filters);
      this.refresh();
    });
  }

  switchKind(itemKind) {
    console.log('switchKind', itemKind);
    this.itemKind = itemKind;
    this.filters.update(itemKind);
    // this.refresh();
  }

  refresh() {
    const types = {
      all: 'all',
      publications: 'publications',
      stats: 'datasets',
      datasets: 'datasets',
      orgs: 'orgs',
      gender_index: 'datasets',
    }[this.itemKind];
    let filters = this.filters.updated.getValue();
    filters = Object.assign(filters,
      {
        stats: {kind: 'Gender Statistics'},
        gender_index: {kind: 'Gender Index'},
      }[this.itemKind] || {}
    );
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { kind: this.itemKind, },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    this.api.searchParams(types, filters);
  }
}
