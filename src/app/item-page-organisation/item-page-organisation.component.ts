import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-item-page-organisation',
  templateUrl: './item-page-organisation.component.html',
  styleUrls: ['./item-page-organisation.component.less']
})
export class ItemPageOrganisationComponent implements OnInit {

  @Input() document: any;

  constructor(private api: ApiService) { }

  website() {
    const website = this.document['org_website'];
    if (website && website.startsWith('http')) {
      return website;
    } else {
      return `https://${website}`;
    }
  }

  ngOnInit() {
    this.api.search(
      null,
      'orgs',
      {
        tags: this.document['tags'],
        // org_name__neq: this.document['org_name']
      }
    );
  }

}