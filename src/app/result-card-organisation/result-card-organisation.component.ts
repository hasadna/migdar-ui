import { Component, OnInit, Input } from '@angular/core';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-result-card-organisation',
  templateUrl: './result-card-organisation.component.html',
  styleUrls: ['./result-card-organisation.component.less']
})
export class ResultCardOrganisationComponent implements OnInit {

  @Input() result: any;
  @Input() queryParams: string;

  constructor(public _: I18nService) { }

  ngOnInit() {
  }

  logo() {
    const url = `assets/logos/${this.result.entity_id}.png`;
    return url;
  }

}
