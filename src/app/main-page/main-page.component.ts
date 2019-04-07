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

  constructor(private api: ApiService,
              public router: Router,
              private bottommer: BottommerService) {
    this.bottommerSubs = this.bottommer.reachedBottom.subscribe(() => {
      this.reveal += 1;
    });
  }

  ngOnInit() {
    this.results = this.api.fetch('all', null, 2);
  }

  search(term) {
    this.router.navigateByUrl(`/search?q=${encodeURIComponent(term)}`);
  }
}
