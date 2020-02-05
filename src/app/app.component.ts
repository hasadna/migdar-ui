import { Component } from '@angular/core';
import { I18nService } from './i18n.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  constructor(public _: I18nService) {}
}
