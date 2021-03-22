import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-stats-page-header',
  templateUrl: './stats-page-header.component.html',
  styleUrls: ['./stats-page-header.component.less']
})
export class StatsPageHeaderComponent implements OnInit, OnDestroy {

  phase = 0;
  interval: number;
  slides: any;

  constructor(public api: ApiService) {
    this.slides = api.fetch('datasets', null, 4, 0, {'kind': 'Gender Statistics', 'chart_type__not': 'hbars'})
      .pipe(
        map(({results, total}) => results)
      );
  }

  ngOnInit() {
    this.interval = window.setInterval(() => {
      this.phase += 1;
      this.phase %= 4;
    }, 5000);
  }

  ngOnDestroy() {
    window.clearInterval(this.interval);
  }

}
