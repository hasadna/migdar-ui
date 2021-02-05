import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderStateService {

  _section: string = null;
  sectionObs = new ReplaySubject<string>(1);

  constructor() { }

  set section(v: string) {
    this._section = v;
    this.sectionObs.next(v);
  }

  clear() {
    this.section = null;
  }
}
