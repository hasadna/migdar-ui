import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-item-page-gender-index',
  templateUrl: './item-page-gender-index.component.html',
  styleUrls: ['./item-page-gender-index.component.less']
})
export class ItemPageGenderIndexComponent implements OnInit {

  @Input() document: any;

  constructor() { }

  ngOnInit() {
  }
}
