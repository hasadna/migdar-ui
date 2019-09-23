import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-gender-index-page-header',
  templateUrl: './gender-index-page-header.component.html',
  styleUrls: ['./gender-index-page-header.component.less']
})
export class GenderIndexPageHeaderComponent implements OnInit, OnDestroy {

  phase = 0;
  interval: number;
  constructor(public api: ApiService, public _: I18nService) { }

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
