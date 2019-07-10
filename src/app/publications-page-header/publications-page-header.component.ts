import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-publications-page-header',
  templateUrl: './publications-page-header.component.html',
  styleUrls: ['./publications-page-header.component.less']
})
export class PublicationsPageHeaderComponent implements OnInit {

  @Output() updated = new EventEmitter<string>();
  constructor(public api: ApiService) { }

  ngOnInit() {
  }

  updatedTerm(term) {
    this.updated.emit(term);
  }
}
