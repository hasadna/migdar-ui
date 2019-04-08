import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-stats-page-header',
  templateUrl: './stats-page-header.component.html',
  styleUrls: ['./stats-page-header.component.less']
})
export class StatsPageHeaderComponent implements OnInit, OnDestroy {

  phase = 0;
  interval: number;
  constructor(public api: ApiService) { }

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