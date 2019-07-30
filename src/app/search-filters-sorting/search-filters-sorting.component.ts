import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { SearchManager } from '../search-manager';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-filters-sorting',
  templateUrl: './search-filters-sorting.component.html',
  styleUrls: ['./search-filters-sorting.component.less']
})
export class SearchFiltersSortingComponent implements OnInit, OnChanges {

  @Input() sortOrder;
  @Input() manager: SearchManager;
  @Output() changed = new EventEmitter<string>();
  term = '';
  sub: Subscription;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.sub = this.manager.parameterStream.subscribe((params) => {
      console.log('QQQQ', params);
      if (params) {
        this.term = params.term;
      }
    });
  }
  get selected(): string {
    return this.sortOrder;
  }

  set selected(selected: string) {
    this.changed.emit(selected);
  }

}
