import { Component, OnInit } from '@angular/core';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-info-page-gender-index',
  templateUrl: './info-page-gender-index.component.html',
  styleUrls: ['./info-page-gender-index.component.less']
})
export class InfoPageGenderIndexComponent implements OnInit {

  constructor(public _: I18nService) { }

  ngOnInit() {
  }

}
