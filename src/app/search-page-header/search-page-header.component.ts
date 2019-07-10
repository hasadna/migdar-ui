import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchManager } from '../search-manager';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-page-header',
  templateUrl: './search-page-header.component.html',
  styleUrls: ['./search-page-header.component.less']
})
export class SearchPageHeaderComponent implements OnInit, OnChanges {

  @Input() term = '';
  @Input() manager: SearchManager;
  num_results: Number;
  num_results_sub: Subscription;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.num_results = null;
    if (this.num_results_sub) {
      this.num_results_sub.unsubscribe();
    }
    if (this.manager) {
      this.num_results_sub = this.manager.totals.subscribe((total) => {
        console.log('NUM RESULTS', total);
        this.num_results = total;
      });
    }
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
  }

}
