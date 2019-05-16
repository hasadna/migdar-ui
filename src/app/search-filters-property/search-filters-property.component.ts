import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FilterManagerService } from '../filter-manager.service';

@Component({
  selector: 'app-search-filters-property',
  templateUrl: './search-filters-property.component.html',
  styleUrls: ['./search-filters-property.component.less']
})
export class SearchFiltersPropertyComponent implements OnInit, OnChanges {

  @Input() itemKind: string;
  @Input() properties: any[];
  selected = null;

  constructor(public filters: FilterManagerService) { }

  ngOnInit() {
    this.selected = this.properties[0];
  }

  ngOnChanges() {
    this.selected = this.properties[0];
  }

  range(num) {
    const ret = [0];
    while (true) {
      const next = ret[ret.length - 1] + 6;
      if (next >= num) {
        break;
      }
      ret.push(next);
    }
    return ret;
  }
}
