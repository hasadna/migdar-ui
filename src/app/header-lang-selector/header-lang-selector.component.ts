import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header-lang-selector',
  templateUrl: './header-lang-selector.component.html',
  styleUrls: ['./header-lang-selector.component.less']
})
export class HeaderLangSelectorComponent implements OnInit {

  @Input() selected: boolean;
  @Output() selectedChange = new EventEmitter<boolean>();

  constructor() { }
  lang = 'עב';
  console = console;

  ngOnInit() {
    if (window.location.pathname.startsWith('/en/')) {
      this.lang = 'en';
    } else if (window.location.pathname.startsWith('/ar/')) {
      this.lang = 'عر';
    } else {
      this.lang = 'עב';
    }
  }

  toggle(event) {
    this.selected = !this.selected;
    this.selectedChange.emit(this.selected);
    event.stopPropagation();
  }

  navigate(to) {
    window.location.href = to;
  }

}
