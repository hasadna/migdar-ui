import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-main-page-card',
  templateUrl: './main-page-card.component.html',
  styleUrls: ['./main-page-card.component.less']
})
export class MainPageCardComponent implements OnInit {

  @Input() logo;
  @Input() colors;

  constructor() { }

  ngOnInit() {
  }

}
