import { Component, OnInit, Input, AfterContentInit, ElementRef } from '@angular/core';
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

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute, private el: ElementRef) {
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
      });
    }

  setActive(section) {
    this.active = section;
  }
}
