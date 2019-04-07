import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.less']
})
export class SearchBarComponent implements OnInit, OnChanges {

  @Input() placeholder = '<strong>מה תרצו לחפש?</strong> שם מאמר, תוכן בנושא מסויים&hellip;';
  @Input() color = '#59334d';
  @Input() backgroundColor = '#fff';
  @Input() icon = 'search-ic';
  @Input() instant = true;
  @Input() term = '';
  @Output() changed = new EventEmitter<string>();

  focus = false;

  constructor() { }

  ngOnInit() {
  }

  onChanged(event, submit) {
    this.term = event.target.value;
    if (this.instant || submit) {
      this.changed.emit(this.term);
    }
  }

  ngOnChanges() {
  }

}
