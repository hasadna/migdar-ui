import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.less']
})
export class SearchPageComponent implements OnInit {

  term = '';
  kind = 'all';
  activatedRouteSubs: Subscription;

  constructor(public api: ApiService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRouteSubs =
      this.activatedRoute.queryParamMap.subscribe((params) => {
        const term = params.get('q');
        this.term = term ? term : '';
        const kind = params.get('kind');
        this.kind = kind ? kind : 'all';
        this.api.searchTerm(this.term);
      });
  }
}
