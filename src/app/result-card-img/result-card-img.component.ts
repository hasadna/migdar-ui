import { Component, OnInit, Input } from '@angular/core';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-result-card-img',
  templateUrl: './result-card-img.component.html',
  styleUrls: ['./result-card-img.component.less']
})
export class ResultCardImgComponent implements OnInit {

  @Input() result: any;
  @Input() visible = true;
  loaded = false;

  constructor(public _: I18nService) { }

  ngOnInit() {
  }

}
