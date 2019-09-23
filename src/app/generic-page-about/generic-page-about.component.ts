import { Component, OnInit } from '@angular/core';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-generic-page-about',
  templateUrl: './generic-page-about.component.html',
  styleUrls: ['./generic-page-about.component.less']
})
export class GenericPageAboutComponent implements OnInit {

  constructor(public _: I18nService) { }

  ngOnInit() {
  }

}
