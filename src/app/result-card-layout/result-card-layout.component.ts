import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { I18nService } from '../i18n.service';

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

  constructor(public router: Router, public _: I18nService) { }

  ngOnInit() {
    this.queryParams = this.queryParams || '';
  }

}
