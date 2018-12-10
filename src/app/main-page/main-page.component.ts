import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less']
})
export class MainPageComponent implements OnInit {

  results: Observable<any>;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.results = this.api.fetch('book', 2);
  }

}
