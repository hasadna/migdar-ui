import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gender-index-page',
  templateUrl: './gender-index-page.component.html',
  styleUrls: ['./gender-index-page.component.less']
})
export class GenderIndexPageComponent implements OnInit {

  datasets = {};
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

  active_dimension = this.dimensions[0];

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

}
