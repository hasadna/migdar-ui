import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.less']
})
export class SearchBarComponent implements OnInit, OnChanges {

  @Input() placeholder;
  @Input() color = '#59334d';
  @Input() backgroundColor = '#fff';
  @Input() icon = 'search-ic';
  @Input() instant = true;
  @Input() term = '';
  @Output() changed = new EventEmitter<string>();
  @Output() submit = new EventEmitter<string>();

  focus = false;

  constructor() { }

  ngOnInit() {
  }

  onChanged(event, submit) {
    if (event instanceof KeyboardEvent) {
      if (event.key === 'Enter') {
        submit = true;
        console.log('SUBMIT!');
      }
    }
    this.term = event.target.value;
    if (this.instant || submit) {
      this.changed.emit(this.term);
    }
    if (submit) {
      this.submit.emit(this.term);
    }
  }

  ngOnChanges() {
  }

}
