import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { I18nService } from '../i18n.service';
import { colorScale as cs } from '../constants';

@Component({
  selector: 'app-result-card-dataset',
  templateUrl: './result-card-dataset.component.html',
  styleUrls: ['./result-card-dataset.component.less']
})
export class ResultCardDatasetComponent implements OnChanges{

  @Input() result: any;
  @Input() genderIndex: boolean;
  @Input() large: boolean;
  @Input() tags = true;

  colorScale = cs;
  _series = null;

  constructor(public _: I18nService) { }

  ngOnChanges() {
    if (this.result) {
      window.setTimeout(() => {
        this._series = this.result.series;
      }, 100);
    } else {
      this._series = null;
    }
  }

}
