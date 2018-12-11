import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';

declare const window: any;

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less']
})
export class MainPageComponent implements OnInit {

  results: Observable<any>;
  reveal = 0;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.results = this.api.fetch('book', 2);
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    if (window.innerHeight + window.pageYOffset + 50 > window.document.body.scrollHeight) {
      this.reveal += 1;
    }
  }
}
