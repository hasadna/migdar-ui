import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-item-page-header',
  templateUrl: './item-page-header.component.html',
  styleUrls: ['./item-page-header.component.less']
})
export class ItemPageHeaderComponent implements OnInit {

  @Input() color: string;

  constructor(public location: Location) { }

  ngOnInit() {
  }

}
