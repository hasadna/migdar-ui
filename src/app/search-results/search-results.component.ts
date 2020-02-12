import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input, OnChanges, HostListener, Renderer2 } from '@angular/core';
import { ApiService } from '../api.service';
import { BottommerService } from '../bottommer.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription, Observable, Subject } from 'rxjs';
import { SearchManager } from '../search-manager';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.less']
})
export class SearchResultsComponent implements OnInit, OnDestroy, OnChanges {

  @Input() manager: SearchManager;
  @Input() results: any[];
  @Input() image = false;
  @Input() preload = false;
  columns = [[], []];
  columnAll = [];
  @ViewChild('column0') column0ref: ElementRef;
  @ViewChild('column1') column1ref: ElementRef;
  @ViewChild('mobilecolumn') mobilecolumnref: ElementRef;
  searchResultsSubs: Subscription;
  bottommerSubs: Subscription;
  visible = false;
  visibleObs = new Subject<any>();
  scrollListenerUnsubscribe: () => void;
  br: ClientRect;

  constructor(public api: ApiService,
              private bottommer: BottommerService,
              private renderer: Renderer2) {
      this.visibleObs.pipe(
        debounceTime(100),
        map(() => {
          this.visibleIfNeeded();
        }),
        debounceTime(1000)
      ).subscribe(() => {
        this.updateBr();
      });
      this.scrollListenerUnsubscribe = this.renderer.listen('window', 'scroll', () => {
        this.visibleObs.next(true);
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
    this.visible = this.preload;
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

  updateBr() {
    const el: Element = this.column0ref.nativeElement || this.mobilecolumnref.nativeElement;
    this.br = el.getBoundingClientRect();
    this.visibleIfNeeded();
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
    if (!this.br) {
      this.updateBr();
    }
    const visible = this.br.top < 1000 && this.br.bottom > 0;
    if (this.columnAll.length && !this.visible && visible) {
      this.visible = true;
      this.scrollListenerUnsubscribe();
    }
  }

}
