import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-result-card-layout',
  templateUrl: './result-card-layout.component.html',
  styleUrls: ['./result-card-layout.component.less']
})
export class ResultCardLayoutComponent implements OnInit {

  @Input() colorClass;

  constructor() { }

  ngOnInit() {
  }

}
