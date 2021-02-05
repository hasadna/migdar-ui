import { Component, OnInit, OnChanges, Input, OnDestroy, ElementRef } from '@angular/core';
import { ApiService } from '../api.service';
import { HeaderStateService } from '../header-state.service';
import { I18nService } from '../i18n.service';
import { ItemPageStatsComponent } from '../item-page-stats/item-page-stats.component';

@Component({
  selector: 'app-item-page-gender-index',
  templateUrl: './item-page-gender-index.component.html',
  styleUrls: ['./item-page-gender-index.component.less']
})
export class ItemPageGenderIndexComponent implements OnInit, OnDestroy {

  @Input() document: any;
  embed = false;

  constructor(private header: HeaderStateService,
              private el: ElementRef,
              public _: I18nService) { }

  ngOnInit() {
    this.header.section = 'gender_index';
  }

  ngOnDestroy() {
    this.header.clear();
  }

  embedCode() {
    return ItemPageStatsComponent._embedCode(this.el);
  }
}
