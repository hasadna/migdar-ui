import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../api.service';
import { SearchManager } from '../search-manager';

@Component({
  selector: 'app-search-dropdown',
  templateUrl: './search-dropdown.component.html',
  styleUrls: ['./search-dropdown.component.less']
})
export class SearchDropdownComponent implements OnInit, OnChanges, OnDestroy {

  @Input() term: string;
  @Output() selected = new EventEmitter<any>();
  manager: SearchManager;
  resultsSub: Subscription;
  results: any[] = [];

  constructor(private api: ApiService) {
    this.manager = new SearchManager(api);
  }

  ngOnInit() {
    this.resultsSub = this.manager.results.subscribe((result) => {
      if (this.results.length < 8) {
        console.log('RESULT', result);
        this.results.push(result);
      }
    })
  }

  ngOnDestroy() {
    if (this.resultsSub) {
      this.resultsSub.unsubscribe();
      this.resultsSub = null;
    }
  }

  ngOnChanges() {
    console.log('TERM', this.term);
    this.results = [];
    if (this.term) {
      this.manager.searchTerm(this.term);
    }
  }

  resultKindClass(result) {
    if (result.__type === 'publications') {
      return 'publication';
    }
    if (result.__type === 'orgs') {
      return 'organization';
    }
    if (result.__type === 'datasets') {
      if (result.kind === 'Gender Statistics') {
        return 'dataset';
      } else {
        return 'gender-index';
      }
    }
  }
}
