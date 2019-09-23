import { Component, OnInit } from '@angular/core';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-info-page-gaps',
  templateUrl: './info-page-gaps.component.html',
  styleUrls: ['./info-page-gaps.component.less']
})
export class InfoPageGapsComponent implements OnInit {

  constructor(public _: I18nService) { }

  ngOnInit() {
  }

}
