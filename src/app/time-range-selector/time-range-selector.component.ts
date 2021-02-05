import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, EventEmitter, Output } from '@angular/core';

import * as d3 from 'd3';
import {sliderBottom} from 'd3-simple-slider';
import { ApiService } from '../api.service';
import { FilterManagerService } from '../filter-manager.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-time-range-selector',
  templateUrl: './time-range-selector.component.html',
  styleUrls: ['./time-range-selector.component.less']
})
export class TimeRangeSelectorComponent implements OnInit, AfterViewInit {

  @ViewChild('container') container: ElementRef;
  @Output() range = new EventEmitter<number[]>();

  constructor(public filters: FilterManagerService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const width = this.container.nativeElement.offsetWidth;
    const height = 150;
    const padding = 20;
    const svg = d3.select(this.container.nativeElement)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${padding},${padding})`);

    const sliderRange = sliderBottom()
      .min(this.filters.absRange['year__gte'])
      .max(this.filters.absRange['year__lte'])
      .width(width - 2 * padding)
      .tickFormat(d3.format(''))
      .ticks(10)
      .default([
        this.filters.selectedRange.year__gte || this.filters.absRange['year__gte'],
        this.filters.selectedRange.year__lte || this.filters.absRange['year__lte']
      ])
      .step(1)
      .handle('M 0 -8 a 8 8 0 1 0 0.00001 0')
      .fill('#59334d')
      .on('onchange', (val) => {
        this.range.emit(val);
      });

    svg.call(sliderRange);
  }

}
