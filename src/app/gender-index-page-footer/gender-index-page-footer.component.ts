import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BottommerService } from '../bottommer.service';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-gender-index-page-footer',
  templateUrl: './gender-index-page-footer.component.html',
  styleUrls: ['./gender-index-page-footer.component.less']
})
export class GenderIndexPageFooterComponent implements OnInit {

  dimensions = [
    'השכלה',
    'שוק העבודה',
    'מגדור מקצועי',
    'ביטחון כלכלי ועוני',
    'עוצמה',
    'תרבות ותקשורת',
    'משפחה וילודה',
    'גיל 65+',
    'זמן',
    'אלימות מגדרית',
    'בריאות',
    'החברה הערבית',
    'החברה החרדית',
    'פריפריה',
  ];
  icons = [
    'aducation',
    'market',
    'occupation',
    'poverty',
    'power',
    'culture',
    'family',
    'elderly',
    'time',
    'violence',
    'health',
    'arabic',
    'religious',
    'suburbs',
  ];

  datasets = {};
  active_dimension = null;
  open = true;

  @ViewChild('datasetsSection') datasetsSection: ElementRef;

  constructor(private api: ApiService, public router: Router,
              private activatedRoute: ActivatedRoute,
              private bottommer: BottommerService,
              public _: I18nService) {
    this.bottommer.reachedBottom.subscribe(() => {
      if (!this.active_dimension) {
        this.selectDimension(this.dimensions[0]);
      }
    });
  }

  ngOnInit() {
    this.api.fetch('datasets', null, 1000, 0)
      .subscribe(({results, total}) => {
        const gender_index_results = results
            .filter((x) => x.kind === 'Gender Index')
            .sort((a, b) => a.series[0].order_index - b.series[0].order_index);
        this.datasets = gender_index_results.reduce((prev, curr) => {
          const key = curr.gender_index_dimension;
          (prev[key] = prev[key] || []).push(curr);
          return prev;
        }, {});
      });
    this.activatedRoute.fragment.subscribe((fragment) => {
      let dimension = fragment;
      if (dimension !== this.active_dimension) {
        this.datasetsSection.nativeElement.scrollIntoView();
        dimension = dimension || this.dimensions[0];
        this.selectDimension(dimension);
      }
    });
  }

  selectDimension(selected) {
    if (selected === this.active_dimension) {
      this.open = !this.open;
    } else {
      this.active_dimension = selected;
      this.open = true;
      this.router.navigate(
        [],
        {
          relativeTo: this.activatedRoute,
          queryParams: { section: selected, },
          queryParamsHandling: 'merge',
          replaceUrl: false
        }
      );
    }
  }

  scrollToChart(id) {
    document.getElementById(id).scrollIntoView({block: 'center'});
  }

}
