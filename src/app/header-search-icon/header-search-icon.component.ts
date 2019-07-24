import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SearchBarComponent } from '../search-bar/search-bar.component';

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

  constructor(private router: Router) { }

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
      this.searchBar.term = '';
    }, 500);
    this.active = false;
  }

  search(term) {
    this.close();
    this.router.navigateByUrl(`/search?q=${encodeURIComponent(term)}`);
  }

}
