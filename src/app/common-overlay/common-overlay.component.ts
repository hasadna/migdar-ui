import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-common-overlay',
  templateUrl: './common-overlay.component.html',
  styleUrls: ['./common-overlay.component.less']
})
export class CommonOverlayComponent implements OnInit {

  show = false;

  constructor() { }

  ngOnInit() {
    window.setTimeout(() => {
      this.show = true;
    }, 0);
  }

}
