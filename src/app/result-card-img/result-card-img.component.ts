import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-result-card-img',
  templateUrl: './result-card-img.component.html',
  styleUrls: ['./result-card-img.component.less']
})
export class ResultCardImgComponent implements OnInit {

  @Input() result: any;

  constructor() { }

  ngOnInit() {
  }

}
