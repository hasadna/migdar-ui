import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-item-page-publication',
  templateUrl: './item-page-publication.component.html',
  styleUrls: ['./item-page-publication.component.less']
})
export class ItemPagePublicationComponent implements OnInit {

  @Input() document: any;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.search(this.document['gd_Life Domains']);
  }

}
