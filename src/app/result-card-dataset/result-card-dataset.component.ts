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
export class ResultCardDatasetComponent implements OnInit, OnChanges, OnDestroy {

  @Input() result: any;
  @Input() genderIndex: boolean;
  @Input() large: boolean;
  @Input() visible = true;
  @Input() tags = true;
  @Input() title = true;

  colorScale = cs;
  _savedResult = null;
  _analyzedColors = null;
  _chart = null;
  ratio = 65;
  
  iobs: IntersectionObserver;
  visible$ = new BehaviorSubject<boolean>(false);
  visibleSub: Subscription = null;

  constructor(public _: I18nService, private el: ElementRef) {}

  ngOnInit() {
    this.visibleSub = this.visible$.subscribe((visible) => {
      if (visible) {
        this._chart = this._savedResult;
        if (this._analyzedColors !== this._chart) {
          analyzeColors(this._chart);
          this._analyzedColors = this._chart;
        }  
      } else {
        this._chart = null;
      }
    });
  }

  ngOnDestroy() {
    this.visibleSub.unsubscribe();
    this.iobs.unobserve(this.el.nativeElement);
    this.iobs.disconnect();
  }

  ngOnChanges() {
    if (this.result !== this._savedResult) {
      this._savedResult = this.result;
    }
    this.ratio = this.result.chart_kind === 'hbars' ? 200 : 60;
    this.visible$.next(this.visible);
  }

}
