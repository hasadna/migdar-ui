import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api.service';
import { FilterManagerService } from '../filter-manager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchManager } from '../search-manager';

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
  @Input() manager: SearchManager;
  @Output() updated = new EventEmitter<any[]>();

  constructor(public filters: FilterManagerService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.sortOrder = this.sortOrder || '';
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
    const filters = this.filters.update(itemKind);
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { kind: itemKind, filters: JSON.stringify(filters)},
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
  }

  refresh() {
    const filters = this.filters.updated.getValue();
    this.updated.emit([filters, this.sortOrder]);
  }
}
