import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-main-page-card',
  templateUrl: './main-page-card.component.html',
  styleUrls: ['./main-page-card.component.less']
})
export class MainPageCardComponent implements OnInit {

  @Input() logo;
  @Input() colors;
  @Input() types = 'all';
  @Input() filters = null;

  slide = new Subject<any>();

  constructor(private api: ApiService) { }

  ngOnInit() {
    if (this.types) {
      this.api.fetch(this.types, null, 1, 0, this.filters)
      .subscribe(({results, total}) => {
        if (results.length > 0) {
          this.slide.next(results);
        }
      });
    }
  }

}
