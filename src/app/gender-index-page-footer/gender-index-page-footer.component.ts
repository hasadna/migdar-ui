import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

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
    'מצב משפחתי',
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
    'time',
    'violence',
    'health',
    'arabic',
    'religious',
    'suburbs',
  ];

  datasets = {};
  active_dimension = this.dimensions[0];
  open = true;

  constructor(private api: ApiService, public router: Router) { }

  ngOnInit() {
    this.api.fetch('datasets', null, 1000, 0)
      .subscribe((results: any[]) => {
        const gender_index_results = results.filter((x) => x.kind === 'Gender Index');
        this.datasets = gender_index_results.reduce((prev, curr) => {
          const key = curr.gender_index_dimension;
          (prev[key] = prev[key] || []).push(curr);
          return prev;
        }, {});
      });
  }

  selectDimension(selected) {
    if (selected === this.active_dimension) {
      this.open = !this.open;
    } else {
      this.active_dimension = selected;
      this.open = true;
    }
  }

  scrollToChart(id) {
    document.getElementById(id).scrollIntoView({block: 'center'});
  }

}
