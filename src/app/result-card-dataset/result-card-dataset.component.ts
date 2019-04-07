import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-result-card-dataset',
  templateUrl: './result-card-dataset.component.html',
  styleUrls: ['./result-card-dataset.component.less']
})
export class ResultCardDatasetComponent implements OnInit {

  @Input() result: any;
  @Input() genderIndex: boolean;
  colorScale: d3.ScaleSequential<string>;

  constructor() { }

  color(idx) {
    return this.colorScale(idx);
  }

  ngOnInit() {
    this.colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, this.result.series.length - 1]);
  }

}
