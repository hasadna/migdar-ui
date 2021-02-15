import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-generic-page',
  templateUrl: './generic-page.component.html',
  styleUrls: ['./generic-page.component.less']
})
export class GenericPageComponent implements OnInit {

  @Input() useBg = false;
  @Input() fullWidth = false;

  constructor() { }

  ngOnInit() {
  }

}
