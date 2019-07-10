import { Component, OnInit, Input } from '@angular/core';
import { SearchManager } from '../search-manager';

@Component({
  selector: 'app-item-page-search-results',
  templateUrl: './item-page-search-results.component.html',
  styleUrls: ['./item-page-search-results.component.less']
})
export class ItemPageSearchResultsComponent implements OnInit {

  @Input() manager: SearchManager;

  constructor() { }

  ngOnInit() {
  }

}
