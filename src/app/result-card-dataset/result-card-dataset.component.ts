import { Component, OnInit, Input, OnChanges, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { I18nService } from '../i18n.service';
import { colorScale as cs, analyzeColors } from '../constants';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-result-card-dataset',
  templateUrl: './result-card-dataset.component.html',
  styleUrls: ['./result-card-dataset.component.less']
})
export class ResultCardDatasetComponent implements OnChanges {

  @Input() result: any;
  @Input() genderIndex: boolean;
  @Input() large: boolean;
  @Input() visible = true;
  @Input() tags = true;
  @Input() title = true;

  colorScale = cs;
  _analyzedColors = null;
  _chart = null;
  ratio = 65;

  constructor(public _: I18nService, private el: ElementRef) {}

  ngOnChanges() {
    if (this.result !== this._chart) {
      this._chart = this.result;
    }
    if (this._analyzedColors !== this._chart) {
      analyzeColors(this._chart);
      this._analyzedColors = this._chart;
    }  
    const chart_type = this.result.chart_type || '';
    this.ratio = chart_type.indexOf('hbars') === 0 ? 200 : 60;
  }

}
