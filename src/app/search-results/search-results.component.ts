import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input, OnChanges, HostListener } from '@angular/core';
import { ApiService } from '../api.service';
import { BottommerService } from '../bottommer.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription, Observable } from 'rxjs';
import { SearchManager } from '../search-manager';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.less']
})
export class SearchResultsComponent implements OnInit, OnDestroy, OnChanges {

  @Input() manager: SearchManager;
  @Input() results: Observable<any>;
  @Input() simple = false;
  @Input() image = false;
  columns = [[], []];
  columnAll = [];
  @ViewChild('column0') column0ref: ElementRef;
  @ViewChild('column1') column1ref: ElementRef;
  @ViewChild('mobilecolumn') mobilecolumnref: ElementRef;
  searchResultsSubs: Subscription;
  bottommerSubs: Subscription;
  visible = false;

  constructor(public api: ApiService,
              private bottommer: BottommerService) {
  }

  ngOnInit() {
    if (!this.simple) {
      this.bottommerSubs = this.bottommer.reachedBottom.subscribe(() => {
        if (this.manager) {
          this.manager.searchMore();
        }
      });
    }
    console.log('SIMPLE', this.simple);
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
    } else if (this.results) {
      this.searchResultsSubs =
        this.results.subscribe((result) => {
          this.assignCard(result);
        });
    }
  }

  assignCard(result) {
    if (this.simple) {
      this.columns[this.columnAll.length % 2].push(result);
      this.columnAll.push(result);
    } else {
      setTimeout(() => {
        this.columnAll.push(result);
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
      }, 0);
    }
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    const el: Element = this.column0ref.nativeElement || this.mobilecolumnref.nativeElement;
    const br = el.getBoundingClientRect();
    const visible = br.top < 1000 && br.bottom > 0;
    if (this.columnAll.length && !this.visible && visible) {
      this.visible = true;
    }
  }

}
