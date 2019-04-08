import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-filters-item-kind',
  templateUrl: './search-filters-item-kind.component.html',
  styleUrls: ['./search-filters-item-kind.component.less']
})
export class SearchFiltersItemKindComponent implements OnInit {

  @Input() itemKind;
  @Output() changed = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  get selected(): string {
    return this.itemKind;
  }

  set selected(selected: string) {
    this.changed.emit(selected);
  }

}
