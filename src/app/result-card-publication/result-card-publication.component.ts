import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-result-card-publication',
  templateUrl: './result-card-publication.component.html',
  styleUrls: ['./result-card-publication.component.less']
})
export class ResultCardPublicationComponent implements OnInit {

  @Input() result: any;

  constructor() { }

  ngOnInit() {
  }

}
