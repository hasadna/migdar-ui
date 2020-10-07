import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderStateService } from '../header-state.service';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  cookie_visible = false;

  constructor(public router: Router,
              public headerState: HeaderStateService,
              public _: I18nService) { }

  _langSelected = false;
  _menuSelected = false;

  set langSelected(value: boolean) {
    this._langSelected = value;
    this._menuSelected = false;
  }

  get langSelected() { return this._langSelected; }

  set menuSelected(value: boolean) {
    this._menuSelected = value;
    this._langSelected = false;
  }

  get menuSelected() { return this._menuSelected; }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cookie_visible = !localStorage.getItem('cookie_consented');
    }, 0);
  }

  cookie_consented() {
    localStorage.setItem('cookie_consented', 'yes');
    this.cookie_visible = false;
  }
}
