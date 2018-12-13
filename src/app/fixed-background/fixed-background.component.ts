import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fixed-background',
  templateUrl: './fixed-background.component.html',
  styleUrls: ['./fixed-background.component.less']
})
export class FixedBackgroundComponent implements OnInit {

  @Input() color: string;

  constructor() { }

  ngOnInit() {
  }

}
