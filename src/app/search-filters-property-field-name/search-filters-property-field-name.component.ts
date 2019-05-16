import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-search-filters-property-field-name',
  templateUrl: './search-filters-property-field-name.component.html',
  styleUrls: ['./search-filters-property-field-name.component.less']
})
export class SearchFiltersPropertyFieldNameComponent implements OnInit {

  @Input() field: string;

  constructor() { }

  ngOnInit() {
  }

}
