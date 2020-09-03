import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { I18nService } from '../i18n.service';
import { colorScale as cs, analyzeColors } from '../constants';

@Component({
  selector: 'app-result-card-dataset',
  templateUrl: './result-card-dataset.component.html',
  styleUrls: ['./result-card-dataset.component.less']
})
export class ResultCardDatasetComponent implements OnChanges {

  @Input() result: any;
  @Input() genderIndex: boolean;
  @Input() large: boolean;
  @Input() tags = true;
  @Input() title = true;
  @Input() queryParams: string;

  colorScale = cs;
  _chart = null;
  ratio = 50;

  constructor(public _: I18nService) { }

  ngOnChanges() {
    if (this.result) {
      this.ratio = this.result.chart_kind === 'hbars' ? 200 : 50;
      window.setTimeout(() => {
        this._chart = this.result;
        analyzeColors(this._chart);
      }, 100);
    } else {
      this._chart = null;
    }
  }

}
