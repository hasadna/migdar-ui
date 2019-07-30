import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { SearchManager } from '../search-manager';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-item-page-publication',
  templateUrl: './item-page-publication.component.html',
  styleUrls: ['./item-page-publication.component.less']
})
export class ItemPagePublicationComponent implements OnInit {

  @Input() document: any;
  search: SearchManager;
  trunc = Math.trunc;

  constructor(private api: ApiService, public _: I18nService) {
    this.search = new SearchManager(api);
  }

  ngOnInit() {
    this.search.search(null, 'all', {tags: this.document['tags']}, '-year');
  }

}
