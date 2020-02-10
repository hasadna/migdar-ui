import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input, OnChanges, HostListener } from '@angular/core';
import { ApiService } from '../api.service';
import { BottommerService } from '../bottommer.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription, Observable, Subject } from 'rxjs';
import { SearchManager } from '../search-manager';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.less']
})
export class SearchResultsComponent implements OnInit, OnDestroy, OnChanges {

  @Input() manager: SearchManager;
  @Input() results: any[];
  @Input() image = false;
  columns = [[], []];
  columnAll = [];
  @ViewChild('column0') column0ref: ElementRef;
  @ViewChild('column1') column1ref: ElementRef;
  @ViewChild('mobilecolumn') mobilecolumnref: ElementRef;
  searchResultsSubs: Subscription;
  bottommerSubs: Subscription;
  visible = false;
  visibleObs = new Subject<any>();

  constructor(public api: ApiService,
              private bottommer: BottommerService) {
      this.visibleObs.pipe(
        debounceTime(1000)
      ).subscribe(() => {
        this.visibleIfNeeded();
      });
  }

  ngOnInit() {
    if (this.manager) {
      this.bottommerSubs = this.bottommer.reachedBottom.subscribe(() => {
        if (this.manager) {
          this.manager.searchMore();
        }
      });
    }
  }

  clear() {
    this.columns = [[], []];
    this.columnAll = [];
  }

  ngOnDestroy() {
    if (this.bottommerSubs) {
      this.bottommerSubs.unsubscribe();
    }
    if (this.searchResultsSubs) {
      this.searchResultsSubs.unsubscribe();
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
    }
  }

  addToColumn(result, simple) {
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
      if (this.columnAll.length === 1) {
        this.visibleIfNeeded();
      }
    }, 0);
  }

  assignCards(results) {
    for (const result of results) {
      this.addToColumn(result, true);
    }
    setTimeout(() => {
      this.visibleIfNeeded();
    }, 0);
  }

  visibleIfNeeded() {
    console.log('visibleIfNeeded?');
    const el: Element = this.column0ref.nativeElement || this.mobilecolumnref.nativeElement;
    const br = el.getBoundingClientRect();
    const visible = br.top < 1000 && br.bottom > 0;
    if (this.columnAll.length && !this.visible && visible) {
      this.visible = true;
    }
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    this.visibleObs.next(true);
  }

}
