import { Component, OnInit, Input, OnChanges, ViewChild,
         ElementRef, HostListener, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { from } from 'rxjs';
import { I18nService } from '../i18n.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gender-index-page-browser-section',
  templateUrl: './gender-index-page-browser-section.component.html',
  styleUrls: ['./gender-index-page-browser-section.component.less']
})
export class GenderIndexPageBrowserSectionComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() results: any[];
  @Input() slug: string;
  @Input() name: string;
  @Input() display: string;

  open = false;
  selected: string = null;
  charts: any[] = [];
  top = 0;
  bottom = 0;
  isActive = false;
  @ViewChild('menu') menu: ElementRef;

  constructor(public _: I18nService, private activatedRoute: ActivatedRoute, private element: ElementRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  ngOnChanges() {
    const charts = [];
    if (this.charts.length === 0 && this.results.length) {
      for (const result of this.results) {
        if (result.gender_index_dimension === this.name) {
          charts.push(result);
        }
      }
      this.charts = charts;
    }
  }

}
