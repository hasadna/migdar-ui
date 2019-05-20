import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { BottommerService } from '../bottommer.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less']
})
export class MainPageComponent implements OnInit {

  results: Observable<any>;
  reveal = 0;
  bottommerSubs: any;
  counts = {
    publications: '?',
    organisations: '?',
    stats: '?',
    gender_index: '?',
  };

  constructor(private api: ApiService,
              public router: Router,
              private bottommer: BottommerService) {
    this.bottommerSubs = this.bottommer.reachedBottom.subscribe(() => {
      this.reveal += 1;
    });
    api.count(null, [
      {
        id: 'publications',
        doc_types: ['publications'],
        filters: []
      },
      {
        id: 'organisations',
        doc_types: ['orgs'],
        filters: []
      },
      {
        id: 'stats',
        doc_types: ['datasets'],
        filters: [{kind: 'Gender Statistics'}]
      },
      {
        id: 'gender_index',
        doc_types: ['datasets'],
        filters: [{kind: 'Gender Index'}]
      },
    ]).subscribe((results) => {
      this.counts = results;
    });
  }

  ngOnInit() {
    this.results = this.api.fetch('all', null, 2);
  }

  search(term) {
    this.router.navigateByUrl(`/search?q=${encodeURIComponent(term)}`);
  }
}
