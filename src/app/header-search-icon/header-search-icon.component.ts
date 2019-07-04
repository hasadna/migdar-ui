import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-search-icon',
  templateUrl: './header-search-icon.component.html',
  styleUrls: ['./header-search-icon.component.less']
})
export class HeaderSearchIconComponent implements OnInit {

  active = false;
  @ViewChild('container') container: ElementRef;

  constructor(private router: Router) { }

  @HostListener('document:click', ['$event'])
  onClickOutOfDropdown(event: any) {
    if (!this.container.nativeElement.contains(event.target)) {
      this.active = false;
    }
  }

  ngOnInit() {
  }

  search(term) {
    this.router.navigateByUrl(`/search?q=${encodeURIComponent(term)}`);
  }

}
