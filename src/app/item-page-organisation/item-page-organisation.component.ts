import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { SearchManager } from '../search-manager';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-item-page-organisation',
  templateUrl: './item-page-organisation.component.html',
  styleUrls: ['./item-page-organisation.component.less']
})
export class ItemPageOrganisationComponent implements OnInit {

  @Input() document: any;
  search: SearchManager;

  constructor(private api: ApiService, public _: I18nService) {
    this.search = new SearchManager(api);
  }

  website() {
    const website = this.document['org_website'];
    if (website && website.startsWith('http')) {
      return website;
    } else {
      return `https://${website}`;
    }
  }

  ngOnInit() {
    this.search.search(
      null,
      'orgs',
      {
        compact_services: this.document.compact_services,
        tags: this.document.tags,
        title_kw__not: this.document.title_kw
      },
      ''
    );
  }

  logo() {
    const url = `assets/logos/${this.document.entity_id}.png`;
    return url;
  }

}
