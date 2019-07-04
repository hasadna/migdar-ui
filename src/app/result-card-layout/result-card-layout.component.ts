import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result-card-layout',
  templateUrl: './result-card-layout.component.html',
  styleUrls: ['./result-card-layout.component.less']
})
export class ResultCardLayoutComponent implements OnInit {

  @Input() colorClass;
  @Input() result: any;
  @Input() queryParams: string;
  @Input() label: string;

  constructor(public router: Router) { }

  ngOnInit() {
    this.queryParams = this.queryParams || '';
  }

}
