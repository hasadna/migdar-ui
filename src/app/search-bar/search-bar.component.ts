import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.less']
})
export class SearchBarComponent implements OnInit {

  @Input() placeholder = '<strong>מה תרצו לחפש?</strong> שם מאמר, תוכן בנושא מסויים&hellip;';
  @Input() color = '#59334d';
  @Input() backgroundColor = '#fff';
  @Input() icon = 'search-ic';
  @Output() changed = new EventEmitter<string>();

  focus = false;
  currentValue = '';

  constructor() { }

  ngOnInit() {
  }

  onChanged(event) {
    this.currentValue = event.target.value;
    this.changed.emit(this.currentValue);
  }

}
