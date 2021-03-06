import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { HeaderStateService } from '../header-state.service';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-gender-index-page',
  templateUrl: './gender-index-page.component.html',
  styleUrls: ['./gender-index-page.component.less']
})
export class GenderIndexPageComponent implements OnInit, OnDestroy {

  constructor(public router: Router, private header: HeaderStateService, public _: I18nService) { }

  ngOnInit() {
    this.header.section = 'gender_index';
  }

  ngOnDestroy() {
    this.header.clear();
  }

}
