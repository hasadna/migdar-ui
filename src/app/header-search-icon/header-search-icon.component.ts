import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SearchManager } from '../search-manager';

@Component({
  selector: 'app-header-search-icon',
  templateUrl: './header-search-icon.component.html',
  styleUrls: ['./header-search-icon.component.less']
})
export class HeaderSearchIconComponent implements OnInit {

  active = false;
  @ViewChild('container') container: ElementRef;
  @ViewChild('searchBar') searchBar: SearchBarComponent;
  term = '';
  searchManager: SearchManager;

  constructor(private router: Router, private api: ApiService) {
    this.searchManager = new SearchManager(api);
  }

  @HostListener('document:click', ['$event'])
  onClickOutOfDropdown(event: any) {
    if (!this.container.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  ngOnInit() {
  }

  close() {
    window.setTimeout(() => {
      this.term = '';
      this.searchBar.term = '';
    }, 500);
    this.active = false;
  }

  search(term) {
    this.term = term;
  }

  searchPage(term) {
    this.close();
    this.router.navigateByUrl(`/search?q=${encodeURIComponent(term)}`);
  }

}
