import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-page-header',
  templateUrl: './search-page-header.component.html',
  styleUrls: ['./search-page-header.component.less']
})
export class SearchPageHeaderComponent implements OnInit {

  @Input() term = '';

  constructor(public api: ApiService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  search(term) {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { q: term, },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    this.api.search(term);
  }

}
