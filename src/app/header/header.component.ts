import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  constructor(public router: Router) { }

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

}
