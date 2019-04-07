import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderStateService {

  section: string = null;

  constructor() { }

  clear() {
    this.section = null;
  }
}
