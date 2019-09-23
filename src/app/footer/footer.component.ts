import { Component, OnInit, HostListener } from '@angular/core';
import { BottommerService } from '../bottommer.service';
import { I18nService } from '../i18n.service';

declare const window: any;


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent implements OnInit {


  constructor(private bottommer: BottommerService,
              public _: I18nService) {}

  ngOnInit() {
  }


  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    if (window.innerHeight + window.pageYOffset + 300 > window.document.body.scrollHeight) {
      this.bottommer.emit();
    }
  }
}
