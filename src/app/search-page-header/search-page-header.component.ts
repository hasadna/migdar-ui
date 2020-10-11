import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchManager } from '../search-manager';
import { Subscription } from 'rxjs';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-search-page-header',
  templateUrl: './search-page-header.component.html',
  styleUrls: ['./search-page-header.component.less']
})
export class SearchPageHeaderComponent implements OnInit, OnChanges {

  @Input() term = '';
  @Input() tag = '';
  @Input() manager: SearchManager;
  num_results: Number;
  num_results_sub: Subscription;
  results_sub: Subscription;
  tags = {};
  sortedTags = [];
  tagCount = 0;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private _: I18nService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.num_results = null;
    if (this.num_results_sub) {
      this.num_results_sub.unsubscribe();
    }
    if (this.results_sub) {
      this.results_sub.unsubscribe();
    }
    if (this.manager) {
      this.num_results_sub = this.manager.totals.subscribe((total) => {
        this.num_results = total;
      });
      this.results_sub = this.manager.results.subscribe((result) => {
        const tags = this._.tags(result);
        this.tagCount += 1;
        if (this.tagCount < 30) {
          for (const tag of tags) {
            if (!this.tags[tag.src]) {
              this.tags[tag.src] = Object.assign({}, tag, {count: 0});
            }
            this.tags[tag.src].count += 1;
          }
          this.sortedTags = Object.values(this.tags).sort((a: any, b: any) => b.count - a.count).slice(0, 5);
        }
      });
      this.tags = {};
      this.sortedTags = [];
      this.tagCount = 0;
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
