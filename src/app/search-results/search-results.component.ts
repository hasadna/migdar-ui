import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input, OnChanges, HostListener, Renderer2, AfterViewInit, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api.service';
import { BottommerService } from '../bottommer.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription, Observable, Subject, BehaviorSubject } from 'rxjs';
import { SearchManager } from '../search-manager';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.less']
})
export class SearchResultsComponent implements OnInit, OnDestroy, OnChanges, AfterContentInit {

  @Input() manager: SearchManager;
  @Input() results: any[];
  @Output() shown = new EventEmitter<void>();
  columns = [[], []];
  columnAll = [];
  @ViewChild('column0') column0ref: ElementRef;
  @ViewChild('column1') column1ref: ElementRef;
  @ViewChild('mobilecolumn') mobilecolumnref: ElementRef;
  searchResultsSubs: Subscription;
  bottommerSubs: Subscription;
  visible = false;

  iobs: IntersectionObserver;
  visible$ = new BehaviorSubject<boolean>(false);
  visibleSub: Subscription = null;

  constructor(public api: ApiService,
              private bottommer: BottommerService,
              private el: ElementRef) {
  }

  ngOnInit() {
    if (this.manager) {
      this.bottommerSubs = this.bottommer.reachedBottom.subscribe(() => {
        if (this.manager) {
          this.manager.searchMore();
        }
      });
    } else {
      this.visibleSub = this.visible$.subscribe((visible) => {
        if (!this.visible && visible) {
          this.visible = visible;
          this.shown.next();
        }
        this.visible = visible;
      });
    }
  }

  restartObserver() {
    if (this.iobs) {
      this.iobs.disconnect();
    }
    this.iobs.observe(this.el.nativeElement);
  }

  ngAfterContentInit() {
    this.iobs = new IntersectionObserver(
      (entries) => {
        this.visible$.next(entries[0].isIntersecting);
      },
      {
        rootMargin: '0px',
        threshold: 0
      }
    );
    this.restartObserver();
  }

  clear() {
    this.columns = [[], []];
    this.columnAll = [];
  }

  ngOnDestroy() {
    if (this.bottommerSubs) {
      this.bottommerSubs.unsubscribe();
      this.bottommerSubs = null;
    }
    if (this.searchResultsSubs) {
      this.searchResultsSubs.unsubscribe();
      this.searchResultsSubs = null;
    }
    if (this.visibleSub) {
      this.visibleSub.unsubscribe();
      this.visibleSub = null;
    }
  }

  ngOnChanges() {
    if (this.searchResultsSubs) {
      this.searchResultsSubs.unsubscribe();
    }
    this.clear();
    if (this.manager) {
      this.searchResultsSubs =
        this.manager.results.subscribe((result) => {
          this.assignCard(result);
        });
    } else if (this.results && this.results.length) {
      this.assignCards(this.results);
      console.log('CHANGES!!');
      setTimeout(() => {
        this.restartObserver();
      }, 0);
    }
  }

  addToColumn(result, simple) {
    if (!result) {
      return;
    }
    if (simple) {
      this.columns[this.columnAll.length % 2].push(result);
    } else {
      try {
        const columnHeights = [this.column0ref.nativeElement.offsetHeight,
                                this.column1ref.nativeElement.offsetHeight];
        if (columnHeights[0] < columnHeights[1]) {
          this.columns[0].push(result);
        } else if (columnHeights[0] > columnHeights[1]) {
          this.columns[1].push(result);
        } else {
          this.columns[this.columnAll.length % 2].push(result);
        }
      } catch (e) {
        console.log('failed to add to columns');
      }
    }
    this.columnAll.push(result);
  }

  assignCard(result) {
    setTimeout(() => {
      this.addToColumn(result, false);
    }, 0);
  }

  assignCards(results) {
    for (const result of results) {
      this.addToColumn(result, true);
    }
  }

}
