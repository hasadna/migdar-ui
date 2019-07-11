import { Component, OnInit, Input } from '@angular/core';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-result-card-publication',
  templateUrl: './result-card-publication.component.html',
  styleUrls: ['./result-card-publication.component.less']
})
export class ResultCardPublicationComponent implements OnInit {

  @Input() result: any;

  constructor(public _: I18nService) { }

  ngOnInit() {
  }

}
