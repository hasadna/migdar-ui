import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { colorScale } from '../constants';
import * as d3 from 'd3';

interface DataEl {
  x: string;
  y: number;
}

interface Series {
  dataset: DataEl[];
  gender: string;
}

@Component({
  selector: 'app-dataset-chart',
  templateUrl: './dataset-chart.component.html',
  styleUrls: ['./dataset-chart.component.less']
})
export class DatasetChartComponent implements OnInit, OnChanges {

  @Input() series: Series[];
  @Input() large: boolean;

  @ViewChild('container') container: ElementRef;

  current = null;

  constructor() { }

  parseYear(x): number {
    return parseInt(x.split('/')[0], 10);
  }

  ngOnInit() {
    this.refresh();
  }

  ngOnChanges() {
    this.refresh();
  }

  refresh() {
    const width = 600;
    const height = 300;
    const marginBottom = 30;
    const marginTop = 30;
    const leftPadding = 70;
    const rightPadding = 70;
    const yMargins = marginBottom + marginTop;

    if (this.series !== this.current) {
      this.current = this.series;
      this.container.nativeElement.innerHTML = '';
    } else {
      return;
    }
    const svg = d3.select(this.container.nativeElement)
                  .append('svg')
                  .attr('viewBox', `0 0 ${width} ${height}`);
    if (this.large) {
      svg.attr('class', 'large');
    }

    const data: DataEl[] = [];
    for (const dataset of this.series) {
      data.push(...dataset.dataset);
    }
    const x = d3.scalePoint()
                .range([leftPadding, width - rightPadding])
                .domain(data.map((d) => d.x).sort());
    const y = d3.scaleLinear()
                .range([height - yMargins, 0])
                .domain(d3.extent(data, (d) => d.y)).nice();
    // const colorScale = d3.scaleSequential(d3.interpolateViridis)
    //                      .domain([0, this.series.length - 1]);

    // Add the X grid
    svg.append('g')
         .attr('class', 'grid')
         .attr('transform', `translate(0, ${height - marginBottom})`)
         .call(d3.axisBottom(x)
                 .tickSize(-height + yMargins)
                 .tickFormat((d) => ''));

    // Add the Y grid
    svg.append('g')
         .attr('class', 'grid')
         .attr('transform', `translate(0, ${marginTop})`)
         .call(d3.axisLeft(y)
                 .ticks(5)
                 .tickSize(-width)
                 .tickFormat((d) => ''));
    // Add the line
    const chart = svg.append('g')
                     .attr('transform', `translate(0, ${marginTop})`);
    const valueline = d3.line<DataEl>()
                        .x((d: DataEl) => x(d.x))
                        .y((d: DataEl) => y(d.y));
    chart.selectAll('.dataline')
         .data(this.series)
         .enter()
         .append('path')
         .attr('class', 'dataline')
         .attr('d', (d) => valueline(d.dataset.sort((a, b) => d3.ascending(a.x, b.x))))
         .style('stroke', colorScale);

    // Add the X Axis
    const xAxis = d3.axisBottom(x)
                    .tickSize(0)
                    .tickFormat((d) => d.replace(RegExp('[0-9]{2}([0-9]{2})', 'g'), `'$1`))
                    ;
    svg.append('g')
        .attr('transform', `translate(0, ${height - marginBottom + 8})`)
        .call(xAxis);

    // Add the Y Axis
    const yAxis = d3.axisLeft(y)
                    .tickSize(0)
                    .ticks(5)
                    .tickPadding(-4);
    svg.append('g')
       .attr('transform', `translate(0, ${marginTop - 8})`)
       .call(yAxis);

    svg.append('path')
       .attr('class', 'bottom')
       .attr('transform', `translate(0, ${height - marginBottom})`)
       .attr('d', `M0,0H${width}`);

  }

}
