import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, EventEmitter, Output, OnDestroy } from '@angular/core';
import { colorScale } from '../constants';
import * as d3 from 'd3';
import { I18nService } from '../i18n.service';
import { fromEvent, Subscription } from 'rxjs';

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
  @Output() ratio = new EventEmitter<number>();

  @ViewChild('container') container: ElementRef;

  current = null;
  series: Series[] = null;

  tooltipSeries: any = null;
  tooltipValueX: any = null;
  tooltipValueY: any = null;
  tooltipLocation = {x: 0, y: 0};


  constructor(public _: I18nService) { }

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
    let r = 0;
    const chart_type: string = this.chart.chart_type || '';
    if (chart_type.indexOf('stacked') === 0) {
      r = this.stacked();
    } else if (chart_type.indexOf('hbars') === 0) {
      r = this.hbars();
    } else {
      r = this.line();
    }
    this.ratio.emit(r);
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

  yFormatter(series) {
    const suffix = {
      'אחוזים עד 100': '%',
      'ש"ח': ' ₪'
    }[series.units] || '';
    return (d: any) => d3.format(',.2~f')(d) + suffix;
  }

  addYAxis(svg, y, top, left) {
    const yAxis = d3.axisLeft(y)
                    .tickSize(0)
                    .ticks(5)
                    .tickFormat(this.yFormatter(this.series[0]))
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
                .range([0, width - rightPadding - leftPadding])
                .domain([0, d3.max(data, (d) => d.y)])
                .nice();
    const g = d3.scaleBand()
                .range([0, height - yMargins])
                .domain(seriesNames)
                .padding(0.02);
    const y = d3.scaleBand()
                .range([0, singleHeight])
                .domain(data.map((d) => d.x).sort())
                .padding(0.15);

    // Create the stack
    const chart = svg.append('g')
                     .attr('transform', `translate(0, ${marginTop})`);
    const groups = chart.selectAll('.bar-group')
         .data(<any[]>this.series)
         .enter();
    groups.append('g')
           .attr('class', 'bar-group')
           .attr('transform', (d) => `translate(0, ${g(d.gender) + seriesPadding})`)
           .style('fill', colorScale);
    groups.append('text')
          .attr('class', 'series-label')
          .attr('dy', seriesPadding - 4)
          .attr('x', 0)
          .attr('y', (d) => g(d.gender))
          .text((d) => this._._(d, 'gender'))
          .style('fill', colorScale);

    const group = chart.selectAll('g.bar-group').selectAll('rect')
         .data((d: any) => d.dataset)
         .enter();
    group.append('rect')
          .attr('x', leftPadding)
          .attr('y', (d: any) => y(d.x))
          .attr('width', (d: any) => x(d.y))
          .attr('height', y.bandwidth());
    group.append('text')
         .attr('class', 'label')
         .attr('x', leftPadding)
         .attr('y', (d: any) => y(d.x))
         .attr('dy', y.bandwidth() / 2)
         .attr('dx', -4)
         .style('dominant-baseline', 'middle')
         .text((d: any) => d.x);

    const suffix = {
      'אחוזים עד 100': '%',
      'ש"ח': ' ₪'
    }[this.series[0].units] || '';
    // const yAxis = d3.axisLeft(y)
    //                 .tickSize(0)
    //                 .ticks(5)
    //                 .tickFormat((d: any) => d3.format(',.2~f')(d) + suffix)
    //                 .tickPadding(-4);
    // svg.append('g')
    //     .attr('class', 'y-axis')
    //     .attr('transform', `translate(${top}, ${left})`)
    //     .call(yAxis);
    // this.addXAxis(svg, x, xValues, height - marginBottom + 8);

    const xAxis = d3.axisTop(x)
                    .tickSize(5)
                    // .ticks(5)
                    .tickFormat((d: any) => d3.format(',.2~f')(d) + suffix)
                    ;
    svg.append('g')
        .attr('transform', `translate(${leftPadding}, ${marginTop})`)
        .call(xAxis);

    svg.append('path')
       .attr('class', 'bottom')
       .attr('transform', `translate(0, ${marginTop})`)
       .attr('d', `M0,0H${width}`);

    return height / width;
  }

  stacked() {
    const width = 600;
    const height = 300;
    const marginBottom = 30;
    const marginTop = 30;
    const leftPadding = 90;
    const rightPadding = 70;
    const maxColumnWidth = 75;
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
    const maxWidth = Math.min(fullXValues.length * maxColumnWidth, width - leftPadding - rightPadding);

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
                .range([leftPadding, leftPadding + maxWidth])
                .domain(data.map((d) => d.x).sort())
                .padding(0.05);
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
         .style('fill', (d, i) => colorScale(this.series[i]))
        //  .on("mouseover", (d) => {
        //     console.log('DDD', d);
        //     const data = d[0].data;
        //     const series = {gender: d.key};
        //     this.tooltipSeries = series;
        //     this.tooltipValueX = data.x;
        //     this.tooltipValueY = this.yFormatter(series)(data[d.key]);
        //     this.tooltipLocation = {
        //       x: d3.event.layerX,
        //       y: d3.event.layerY
        //     };
        //   })
        // .on("mouseout", (d) => {
        //    this.tooltipSeries = null;
        // })
        ;



    chart.selectAll('g.bar-stack').selectAll('rect')
         .data((d: any[]) => d.map((x) => Object.assign(x, {__series: d})), (s: any) => s.x)
         .enter()
         .append('rect')
         .attr('x', (d, i) => x(prepared[i].x))
         .attr('y', (d) => y(d[1]))
         .attr('height', (d) => y(d[0]) - y(d[1]))
         .attr('width', x.bandwidth())
         .on("mouseover", (d) => {
            console.log('DDD', d);
            const data = d.data;
            const key = d.__series.key
            const series = {gender: key};
            this.tooltipSeries = series;
            this.tooltipValueX = data.x;
            this.tooltipValueY = this.yFormatter(series)(data[key]);
            this.tooltipLocation = {
              x: d3.event.layerX,
              y: d3.event.layerY
            };
          })
          .on("mouseout", (d) => {
            this.tooltipSeries = null;
          });
         ;

    this.addXAxis(svg, x, xValues, height - marginBottom + 8);
    this.addYAxis(svg, y, leftPadding - 16, marginTop - 8);

    svg.append('path')
       .attr('class', 'bottom')
       .attr('transform', `translate(0, ${height - marginBottom})`)
       .attr('d', `M0,0H${width}`);

    return height / width;
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
      xValues = xValues.filter((v, i) => (i % 2) !== (xValues.length % 2));
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

    const circles = chart.selectAll('.datapoints')
         .data(this.series)
         .enter()
         .append('g')
         .attr('class', 'datapoints')
         .style('fill', colorScale);


    circles.selectAll('.datapoint')
         .data((d) => d.dataset.map((x) => Object.assign(x, {__series: d})))
         .enter()
         .append('circle')
         .attr('class', 'datapoint')
         .attr('cx', (d: any) => x(d.x))
         .attr('cy', (d: any) => y(d.y))
         .attr('r', 5)
         .on("mouseover", (d) => {
            this.tooltipSeries = d.__series;
            this.tooltipValueX = d.x;
            this.tooltipValueY = this.yFormatter(d.__series)(d.y);
            this.tooltipLocation = {
              x: d3.event.layerX,
              y: d3.event.layerY
            };
          })
          .on("mouseout", (d) => {
            this.tooltipSeries = null;
          });


    this.addXAxis(svg, x, xValues, height - marginBottom + 8);
    this.addYAxis(svg, y, leftPadding - 16, marginTop - 8);

    svg.append('path')
       .attr('class', 'bottom')
       .attr('transform', `translate(0, ${height - marginBottom})`)
       .attr('d', `M0,0H${width}`);

    return height / width;
  }

}
