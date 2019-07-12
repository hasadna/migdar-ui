import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { I18nService } from '../i18n.service';
import { colorScale as cs } from '../constants';

@Component({
  selector: 'app-result-card-dataset',
  templateUrl: './result-card-dataset.component.html',
  styleUrls: ['./result-card-dataset.component.less']
})
export class ResultCardDatasetComponent {

  @Input() result: any;
  @Input() genderIndex: boolean;
  @Input() large: boolean;

  colorScale = cs;

  constructor(public _: I18nService) { }

}
