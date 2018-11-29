import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.less']
})
export class HeaderMenuComponent implements OnInit {

  @Input() selected: boolean;
  @Output() selectedChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  toggle(event) {
    this.selected = !this.selected;
    this.selectedChange.emit(this.selected);
    event.stopPropagation();
  }

}
