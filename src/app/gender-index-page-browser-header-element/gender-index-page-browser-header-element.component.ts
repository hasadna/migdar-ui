import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gender-index-page-browser-header-element',
  templateUrl: './gender-index-page-browser-header-element.component.html',
  styleUrls: ['./gender-index-page-browser-header-element.component.less']
})
export class GenderIndexPageBrowserHeaderElementComponent implements OnInit {

  @Input() selected: string;
  @Input() active: string;
  @Input() slug: string;
  @Input() name: string;
  @Input() display: string;

  constructor() { }

  ngOnInit() {
  }

}
