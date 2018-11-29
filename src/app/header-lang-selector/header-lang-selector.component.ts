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

  ngOnInit() {
  }

  toggle(event) {
    this.selected = !this.selected;
    this.selectedChange.emit(this.selected);
    event.stopPropagation();
  }

}
