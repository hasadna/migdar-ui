import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gender-index-page-browser',
  templateUrl: './gender-index-page-browser.component.html',
  styleUrls: ['./gender-index-page-browser.component.less']
})
export class GenderIndexPageBrowserComponent implements OnInit {

  @Input() active = null;

  results: any[] = [];
  selected = null;
  savedActive = null;

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.fragment.subscribe((fragment) => {
      const dimension = fragment;
      if (dimension) {
        this.selected = dimension;
      }
    });
  }

  ngOnInit() {
    this.api.fetch('datasets', null, 1000, 0)
      .subscribe(({results, total}) => {
        const gender_index_results = results
            .filter((x) => x.kind === 'Gender Index')
            .sort((a, b) => a.series[0].order_index - b.series[0].order_index);
        this.results = gender_index_results;
        window.setTimeout(() => {
          this.setActive(this.savedActive);
        }, 1000);
        // this.datasets = gender_index_results.reduce((prev, curr) => {
        //   const key = curr.gender_index_dimension;
        //   (prev[key] = prev[key] || []).push(curr);
        //   return prev;
        // }, {});
      });
    }

  setActive(section) {
    if (this.results && this.results.length) {
      this.active = section;
    } else {
      this.savedActive = section;
    }
  }
}
