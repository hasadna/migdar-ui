import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-result-card',
  templateUrl: './result-card.component.html',
  styleUrls: ['./result-card.component.less']
})
export class ResultCardComponent implements OnInit {

  @Input() result: any;
  @Input() queryParams: any;
  @Input() tags = true;

  constructor() { }

  ngOnInit() {
    this.queryParams = this.queryParams || '';
  }

}
