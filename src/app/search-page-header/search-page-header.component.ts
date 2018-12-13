import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-search-page-header',
  templateUrl: './search-page-header.component.html',
  styleUrls: ['./search-page-header.component.less']
})
export class SearchPageHeaderComponent implements OnInit {

  constructor(public api: ApiService) { }

  ngOnInit() {
  }

}
