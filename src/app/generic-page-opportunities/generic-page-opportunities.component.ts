import { Component, OnInit } from '@angular/core';
import { HeaderStateService } from '../header-state.service';

@Component({
  selector: 'app-generic-page-opportunities',
  templateUrl: './generic-page-opportunities.component.html',
  styleUrls: ['./generic-page-opportunities.component.less']
})
export class GenericPageOpportunitiesComponent implements OnInit {

  constructor(private header: HeaderStateService) { }

  ngOnInit() {
    this.header.section = 'opportunities';
  }

}
