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
  @Output() active = new EventEmitter<string>();

  open = false;
  chartsObservable = null;
  selected: string = null;
  charts: any[] = [];
  top = 0;
  bottom = 0;
  isActive = false;
  @ViewChild('menu') menu: ElementRef;

  constructor(public _: I18nService, private activatedRoute: ActivatedRoute, private element: ElementRef) {
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const nowActive = (window.scrollY > (this.top - 200)) && (window.scrollY < (this.bottom - 200));
    if (this.isActive !== nowActive) {
      if (nowActive) {
        this.active.emit(this.name);
      }
      this.isActive = nowActive;
    }
  }

  ngOnInit() {
    this.activatedRoute.fragment.subscribe((fragment) => {
      this.selected = fragment;
      window.setTimeout(() => {
        this.scrollIfNeeded();
      }, 100);
    });
  }

  ngAfterViewInit() {
    window.setTimeout(() => {
      this.scrollIfNeeded();
    }, 100);
  }

  scrollIfNeeded() {
    const el = this.element.nativeElement;
    const rect = el.getBoundingClientRect();
    this.top = rect.top + window.scrollY - 186;
    this.bottom = rect.bottom + window.scrollY - 186;
    if (this.selected === this.name) {
      console.log('scrolling to', this.name, this.top);
      window.scrollTo({
        top: this.top,
        left: 0,
        behavior: 'smooth'
      });
    }
  }

  ngOnChanges() {
    if (this.results.length) {
      window.setTimeout(() => {
        this.scrollIfNeeded();
      }, 100);
      for (const result of this.results) {
        if (result.gender_index_dimension === this.name) {
          this.charts.push(result);
        }
      }
      this.chartsObservable = from(this.charts);
    }
  }

}
