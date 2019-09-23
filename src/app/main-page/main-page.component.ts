import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { BottommerService } from '../bottommer.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { map } from 'rxjs/operators';
import { I18nService } from '../i18n.service';

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
    publications: {total_overall: 0},
    orgs: {total_overall: 0},
    stats: {total_overall: 0},
    gender_index: {total_overall: 0},
  };

  constructor(private api: ApiService,
              public router: Router,
              private bottommer: BottommerService,
              public _: I18nService) {
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
        id: 'orgs',
        doc_types: ['orgs'],
        filters: []
      },
      {
        id: 'stats',
        doc_types: ['datasets'],
        filters: []
      },
    ]).subscribe((results) => {
      this.counts = results;
    });
  }

  ngOnInit() {
    this.results = this.api.fetch('all', null, 2, 0, {}, '-year').pipe(
      map(({results, total}) => results)
    );
  }

  search(term, kind) {
    kind = kind || 'all';
    this.router.navigateByUrl(`/search?q=${encodeURIComponent(term)}&kind=${kind}`);
  }
}
