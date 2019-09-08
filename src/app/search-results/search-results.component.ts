import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input, OnChanges } from '@angular/core';
import { ApiService } from '../api.service';
import { BottommerService } from '../bottommer.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription, Observable } from 'rxjs';
import { SearchManager } from '../search-manager';

@AutoUnsubscribe()
@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.less']
})
export class SearchResultsComponent implements OnInit, OnDestroy, OnChanges {

  @Input() manager: SearchManager;
  @Input() results: Observable<any>;
  columns = [[], []];
  columnAll = [];
  @ViewChild('column0') column0ref: ElementRef;
  @ViewChild('column1') column1ref: ElementRef;
  searchResultsSubs: Subscription;
  bottommerSubs: Subscription;

  constructor(public api: ApiService,
              private bottommer: BottommerService) {
  }

  ngOnInit() {
    this.bottommerSubs = this.bottommer.reachedBottom.subscribe(() => {
      if (this.manager) {
        this.manager.searchMore();
      }
    });
  }

  ngOnDestroy() {
    this.columns = [[], []];
    this.columnAll = [];
  }

  ngOnChanges() {
    if (this.searchResultsSubs) {
      this.searchResultsSubs.unsubscribe();
    }
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
    this.ngOnDestroy();
  }

  assignCard(result) {
    setTimeout(() => {
      try {
        const columnHeights = [this.column0ref.nativeElement.offsetHeight,
                               this.column1ref.nativeElement.offsetHeight];
        if (columnHeights[0] <= columnHeights[1]) {
          this.columns[0].push(result);
        } else {
          this.columns[1].push(result);
        }
      } catch (e) {
        console.log('ERROR');
      }
      this.columnAll.push(result);
    }, 0);
  }

}
