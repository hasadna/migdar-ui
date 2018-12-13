import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../api.service';
import { BottommerService } from '../bottommer.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.less']
})
export class SearchResultsComponent implements OnInit {

  columns = [[], []];
  @ViewChild('column0') column0ref: ElementRef;
  @ViewChild('column1') column1ref: ElementRef;

  constructor(public api: ApiService,
              private bottommer: BottommerService) {
    this.api.results.subscribe((results) => {
      if (results.length === 0) {
        this.columns = [[], []];
      } else {
        this.assignCard(results);
      }
    });
    this.bottommer.reachedBottom.subscribe(() => {
      api.searchMore();
    });
  }

  assignCard(results) {
    const currentAmount = this.columns[0].length + this.columns[1].length;
    if (results.length > currentAmount) {
      setTimeout(() => {
        const columnHeights = [this.column0ref.nativeElement.offsetHeight,
                               this.column1ref.nativeElement.offsetHeight];
        console.log(this.column0ref.nativeElement);
        console.log(columnHeights);
        if (columnHeights[0] <= columnHeights[1]) {
          this.columns[0].push(results[currentAmount]);
        } else {
          this.columns[1].push(results[currentAmount]);
        }
        if (results.length > 1) {
          this.assignCard(results);
        }
      }, 0);
    }
  }

  ngOnInit() {
  }

}
