import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BottommerService {
  public reachedBottom = new Subject();

  emit() {
    this.reachedBottom.next(null);
  }

  constructor() { }
}
