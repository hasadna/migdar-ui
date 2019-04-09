import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-item-page-stats',
  templateUrl: './item-page-stats.component.html',
  styleUrls: ['./item-page-stats.component.less']
})
export class ItemPageStatsComponent implements OnInit, OnChanges {

  @Input() document: any;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.refresh();
  }

  ngOnChanges() {
    this.refresh();
  }

  refresh() {
    this.api.search(
      null,
      'datasets',
      {
        life_areas: this.document['life_areas'],
        tags: this.document['tags'],
        doc_id__not: this.document['doc_id'],
      }
    );
  }

}
