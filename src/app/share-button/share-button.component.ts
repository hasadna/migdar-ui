import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.less']
})
export class ShareButtonComponent implements OnInit {

  @Input() kind: string;

  constructor() { }

  ngOnInit() {
  }

  openShareDialog() {
    const href = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${href}`, 'pop', 'width=600, height=400, scrollbars=no');
  }

}
