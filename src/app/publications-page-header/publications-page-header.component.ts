import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-publications-page-header',
  templateUrl: './publications-page-header.component.html',
  styleUrls: ['./publications-page-header.component.less']
})
export class PublicationsPageHeaderComponent implements OnInit {

  @Output() updated = new EventEmitter<string>();
  @ViewChild('searchBar') searchBar: ElementRef;
  constructor(public api: ApiService) { }

  ngOnInit() {
  }

  updatedTerm(term) {
    const el = this.searchBar.nativeElement;
    const top = el.getBoundingClientRect().top + window.scrollY - 75;
    if (window.scrollY < top) {
      window.scrollTo({
        top: top,
        left: 0,
        behavior: 'smooth'
      });
    }
    this.updated.emit(term);
  }
}
