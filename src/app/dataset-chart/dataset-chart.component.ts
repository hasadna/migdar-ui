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
  units: string;
}

@Component({
  selector: 'app-dataset-chart',
  templateUrl: './dataset-chart.component.html',
  styleUrls: ['./dataset-chart.component.less']
})
export class DatasetChartComponent implements OnInit, OnChanges {

  @Input() chart: any;
  @Input() large: boolean;

  @ViewChild('container') container: ElementRef;

  current = null;
  series: Series[] = null;

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
    if (!this.chart || !this.chart.series) {
      return;
    }
    this.series = this.chart.series;
    if (this.series !== this.current) {
      this.current = this.series;
      this.container.nativeElement.innerHTML = '';
    } else {
      return;
    }
    if (this.chart.chart_type === 'stacked') {
      this.stacked();
    } else if (this.chart.chart_type === 'hbars') {
      this.hbars();
    } else {
      this.line();
    }
  }

  addXAxis(svg, x, xValues, position) {
    // Add the X Axis
    const xAxis = d3.axisBottom(x)
                    .tickSize(0)
                    .tickValues(xValues)
                    .tickFormat((d: string) => d.replace(RegExp('[0-9]{2}([0-9]{2})', 'g'), `'$1`))
                    ;
    svg.append('g')
        .attr('transform', `translate(0, ${position})`)
        .call(xAxis);
  }

  addYAxis(svg, y, top, left) {
    const suffix = {
      'אחוזים עד 100': '%',
      'ש"ח': ' ₪'
    }[this.series[0].units] || '';
    const yAxis = d3.axisLeft(y)
                    .tickSize(0)
                    .ticks(5)
                    .tickFormat((d: any) => d3.format(',.2~f')(d) + suffix)
                    .tickPadding(-4);
    svg.append('g')
       .attr('class', 'y-axis')
       .attr('transform', `translate(${top}, ${left})`)
       .call(yAxis);
  }

  addGrid(svg, x, y, width, height, marginTop, marginBottom) {
    // Add the X grid
    svg.append('g')
         .attr('class', 'grid')
         .attr('transform', `translate(0, ${height - marginBottom})`)
         .call(d3.axisBottom(x)
                 .tickSize(-height + marginBottom + marginTop)
                 .tickFormat((d) => ''));

    // Add the Y grid
    svg.append('g')
         .attr('class', 'grid')
         .attr('transform', `translate(0, ${marginTop})`)
         .call(d3.axisLeft(y)
                 .ticks(5)
                 .tickSize(-width)
                 .tickFormat((d) => ''));
  }

  addSvg(width, height) {
    const svg = d3.select(this.container.nativeElement)
              .append('svg')
              .attr('viewBox', `0 0 ${width} ${height}`);
    if (this.large) {
      svg.attr('class', 'large');
    }
    return svg;
  }

  hbars() {
    const width = 600;
    const marginBottom = 30;
    const marginTop = 30;
    const leftPadding = 90;
    const rightPadding = 70;
    const barHeight = 20;
    const seriesPadding = 30;
    const yMargins = marginBottom + marginTop;

   const data: DataEl[] = [];
    for (const dataset of this.series) {
      data.push(...dataset.dataset);
    }
    const xValues = Array.from(new Set(data.map((d) => d.x))).sort();
    const seriesNames = this.series.map((s) => s.gender);

    const singleHeight = barHeight * xValues.length;
    const height = singleHeight * seriesNames.length + seriesPadding * (seriesNames.length - 1);

    const svg = this.addSvg(width, height);

    const x = d3.scaleLinear()
                .range([leftPadding, width - rightPadding])
                .domain(d3.extent(data, (d) => d.y))
                .nice();
    const g = d3.scaleBand()
                .range([0, height - yMargins])
                .domain(seriesNames)
                .padding(0.02);
    const y = d3.scaleBand()
                .range([0, singleHeight])
                .domain(data.map((d) => d.x).sort())
                .padding(0.15);

    this.addGrid(svg, x, y, width, height, marginTop, marginBottom);

    // Create the stack
    const chart = svg.append('g')
                     .attr('transform', `translate(0, ${marginTop})`);
    chart.selectAll('.bar-stack')
         .data(<any[]>stack)
         .enter()
         .append('g')
         .attr('class', 'bar-stack')
         .style('fill', (d, i) => {
            return colorScale(this.series[i], i);
          });


    chart.selectAll('g.bar-stack').selectAll('rect')
         .data((d) => <any[]>d, (s) => (<any>s).x)
         .enter()
         .append('rect')
         .attr('x', (d, i) => x(prepared[i].x))
         .attr('y', (d) => y(d[1]))
         .attr('height', (d) => y(d[0]) - y(d[1]))
         .attr('width', x.bandwidth());

    this.addXAxis(svg, x, xValues, height - marginBottom + 8);
    this.addYAxis(svg, y, leftPadding - 16, marginTop - 8);

    svg.append('path')
       .attr('class', 'bottom')
       .attr('transform', `translate(0, ${height - marginBottom})`)
       .attr('d', `M0,0H${width}`);

  }

  stacked() {
    const width = 600;
    const height = 300;
    const marginBottom = 30;
    const marginTop = 30;
    const leftPadding = 90;
    const rightPadding = 70;
    const yMargins = marginBottom + marginTop;

    const svg = this.addSvg(width, height);

    const data: DataEl[] = [];
    for (const dataset of this.series) {
      data.push(...dataset.dataset);
    }
    const fullXValues = Array.from(new Set(data.map((d) => d.x))).sort();
    let xValues;
    if (!this.large && fullXValues.length > 16) {
      xValues = fullXValues.filter((v, i) => i % 2);
    }

    let prepared = {};

    const seriesNames = this.series.map((s) => s.gender);
    for (const s of this.series) {
      for (const d of s.dataset) {
        prepared[d.x] = prepared[d.x] || {x: d.x};
        prepared[d.x][s.gender] = d.y;
      }
    }
    prepared = fullXValues.map((d) => prepared[d]);
    const stackObj = d3.stack()
              .keys(seriesNames)
              .order(d3.stackOrderDescending);
    const stack = stackObj(<any>prepared);

    const x = d3.scaleBand()
                .range([leftPadding, width - rightPadding])
                .domain(data.map((d) => d.x).sort())
                .padding(0.02);
    const y = d3.scaleLinear()
                .range([height - yMargins, 0])
                .domain([0, d3.max(stack, (s) => d3.max(s, (d) => d[1]))])
                .nice();

    this.addGrid(svg, x, y, width, height, marginTop, marginBottom);

    // Create the stack
    const chart = svg.append('g')
                     .attr('transform', `translate(0, ${marginTop})`);
    chart.selectAll('.bar-stack')
         .data(<any[]>stack)
         .enter()
         .append('g')
         .attr('class', 'bar-stack')
         .style('fill', (d, i) => {
            return colorScale(this.series[i], i);
          });


    chart.selectAll('g.bar-stack').selectAll('rect')
         .data((d) => <any[]>d, (s) => (<any>s).x)
         .enter()
         .append('rect')
         .attr('x', (d, i) => x(prepared[i].x))
         .attr('y', (d) => y(d[1]))
         .attr('height', (d) => y(d[0]) - y(d[1]))
         .attr('width', x.bandwidth());

    this.addXAxis(svg, x, xValues, height - marginBottom + 8);
    this.addYAxis(svg, y, leftPadding - 16, marginTop - 8);

    svg.append('path')
       .attr('class', 'bottom')
       .attr('transform', `translate(0, ${height - marginBottom})`)
       .attr('d', `M0,0H${width}`);

  }

  line() {
    const width = 600;
    const height = 300;
    const marginBottom = 30;
    const marginTop = 30;
    const leftPadding = 90;
    const rightPadding = 70;
    const yMargins = marginBottom + marginTop;

    const svg = this.addSvg(width, height);

    const data: DataEl[] = [];
    for (const dataset of this.series) {
      data.push(...dataset.dataset);
    }
    let xValues = Array.from(new Set(data.map((d) => d.x))).sort();
    if (!this.large && xValues.length > 16) {
      xValues = xValues.filter((v, i) => i % 2);
    }
    const x = d3.scalePoint()
                .range([leftPadding, width - rightPadding])
                .domain(data.map((d) => d.x).sort());
    const y = d3.scaleLinear()
                .range([height - yMargins, 0])
                .domain(d3.extent(data, (d) => d.y)).nice();

    this.addGrid(svg, x, y, width, height, marginTop, marginBottom);

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

    this.addXAxis(svg, x, xValues, height - marginBottom + 8);
    this.addYAxis(svg, y, leftPadding - 16, marginTop - 8);

    svg.append('path')
       .attr('class', 'bottom')
       .attr('transform', `translate(0, ${height - marginBottom})`)
       .attr('d', `M0,0H${width}`);
  }

}
