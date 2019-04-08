import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-filters-sorting',
  templateUrl: './search-filters-sorting.component.html',
  styleUrls: ['./search-filters-sorting.component.less']
})
export class SearchFiltersSortingComponent implements OnInit {

  @Input() sortOrder;
  @Output() changed = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  get selected(): string {
    return this.sortOrder;
  }

  set selected(selected: string) {
    this.changed.emit(selected);
  }

}
