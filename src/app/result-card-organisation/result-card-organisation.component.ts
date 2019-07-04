import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-result-card-organisation',
  templateUrl: './result-card-organisation.component.html',
  styleUrls: ['./result-card-organisation.component.less']
})
export class ResultCardOrganisationComponent implements OnInit {

  @Input() result: any;

  constructor() { }

  ngOnInit() {
  }

  logo() {
    const url = `assets/logos/${this.result.entity_id}.png`;
    return url;
  }

}
