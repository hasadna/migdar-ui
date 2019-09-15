import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { SearchManager } from '../search-manager';
import { FilterManagerService } from '../filter-manager.service';
import { filter } from 'rxjs/operators';

@AutoUnsubscribe()
@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.less']
})
export class SearchPageComponent implements OnInit {
  term = '';
  kind = 'all';
  tag = null;
  sortOrder = null;

  activatedRouteSubs: Subscription;
  search: SearchManager;

  constructor(private api: ApiService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private filterManager: FilterManagerService) {
  }

  ngOnInit() {
    this.activatedRouteSubs =
      this.activatedRoute.queryParamMap.subscribe((params) => {
        this.term = params.get('q') || '';
        this.tag = params.get('tag');

        this.kind = params.get('kind');
        const searchKind = {
          all: 'all',
          publications: 'publications',
          stats: 'datasets',
          datasets: 'datasets',
          orgs: 'orgs',
          gender_index: 'datasets',
        }[this.kind] || 'all';

        let filters = params.get('filters');
        filters = filters ? JSON.parse(filters) : {};
        this.filterManager.updateFrom(this.kind, filters);
        const searchFilters = Object.assign(filters,
          {
            stats: {kind: 'Gender Statistics'},
            gender_index: {kind: 'Gender Index'},
          }[this.kind] || {},
          this.tag ? {tags: this.tag} : {}
        );
        this.sortOrder = params.get('sortOrder');

        this.search = new SearchManager(this.api);
        window.setTimeout(() => {
          this.search.search(this.term, searchKind, searchFilters, this.sortOrder);
        }, 0);
      });
  }

  updateFilters(event) {
    const filters = event[0];
    const sortOrder = event[1];
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { filters: JSON.stringify(filters), sortOrder: sortOrder },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
  }
}
