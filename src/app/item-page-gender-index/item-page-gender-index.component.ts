import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { HeaderStateService } from '../header-state.service';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-item-page-gender-index',
  templateUrl: './item-page-gender-index.component.html',
  styleUrls: ['./item-page-gender-index.component.less']
})
export class ItemPageGenderIndexComponent implements OnInit, OnDestroy {

  @Input() document: any;

  constructor(private header: HeaderStateService,
              public _: I18nService) { }

  ngOnInit() {
    this.header.section = 'gender_index';
  }

  ngOnDestroy() {
    this.header.clear();
  }
}
