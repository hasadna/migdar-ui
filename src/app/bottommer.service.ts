import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BottommerService {
  public reachedBottom = new EventEmitter<any>();

  emit() {
    this.reachedBottom.emit(null);
  }

  constructor() { }
}
