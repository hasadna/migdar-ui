import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-result-card-dataset',
  templateUrl: './result-card-dataset.component.html',
  styleUrls: ['./result-card-dataset.component.less']
})
export class ResultCardDatasetComponent implements OnInit, OnChanges {

  @Input() result: any;
  @Input() genderIndex: boolean;
  @Input() large: boolean;
  colorScale: d3.ScaleSequential<string>;

  constructor(public _: I18nService) { }

  color(idx) {
    return this.colorScale(idx);
  }

  ngOnInit() {
    this.refresh();
  }

  ngOnChanges() {
    this.refresh();
  }

  refresh() {
    this.colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, this.result.series.length - 1]);
  }

}
