import { Component, OnInit, Input, OnChanges, ElementRef } from '@angular/core';
import { ApiService } from '../api.service';
import { SearchManager } from '../search-manager';
import { I18nService } from '../i18n.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-item-page-stats',
  templateUrl: './item-page-stats.component.html',
  styleUrls: ['./item-page-stats.component.less']
})
export class ItemPageStatsComponent implements OnInit, OnChanges {

  @Input() document: any;
  search: SearchManager;

  data_sources = [];
  embed = false;

  constructor(private api: ApiService, public _: I18nService, public el: ElementRef) {
    this.search = new SearchManager(api);
  }

  ngOnInit() {
    this.refresh();
  }

  ngOnChanges() {
    this.refresh();
  }

  refresh() {
    this.data_sources = [];
    this.search = new SearchManager(this.api);
    this.search.search(
      null,
      'datasets',
      {
        life_areas: this.document.life_areas,
        tags: this.document.tags,
        title_kw__not: this.document.title_kw,
      },
      null
    );
  }

  embedCode() {
    return ItemPageStatsComponent._embedCode(this.el);
  }

  static _embedCode(el: ElementRef) {
    const nel = (el.nativeElement as HTMLElement).querySelector('app-dataset-chart') as HTMLElement;
    const ratio = Math.round(100 * nel.offsetHeight / nel.offsetWidth);
    const url = window.location.href.replace('/item/', '/embed/');
    return `<div style='width:100%;height:0;padding-bottom:calc(180px + ${ratio}%);position:relative;'>
    <iframe src='${url}' 
            width='100%' height='100%' frameborder="0" 
            style='position:absolute;top:0;left:0;height:100%;width:100%'>
    </iframe>
</div>`;
  }
}
