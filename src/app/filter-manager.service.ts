import { Injectable } from '@angular/core';
import { FILTERS_CONFIG } from './constants';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterManagerService {

  public CONFIG = FILTERS_CONFIG;

  private selected = {};

  public updated = new BehaviorSubject<any>({});

  constructor() { }

  get(kind: string, field: string): string[] {
    this.selected[kind] = this.selected[kind] || {};
    this.selected[kind][field] = this.selected[kind][field] || [];
    return this.selected[kind][field];
  }

  numSelected(kind, field) {
    return this.get(kind, field).length || '-';
  }

  isSelected(kind, field, value) {
    return this.get(kind, field).includes(value);
  }

  update(kind) {
    this.selected[kind] = this.selected[kind] || {};
    const filters = {};
    for (const field of Object.keys(this.selected[kind])) {
      const values = this.selected[kind][field];
      if (values && values.length) {
        filters[field] = values;
      }
    }
    this.updated.next(filters);
  }

  deselect(kind, field, value) {
    this.selected[kind][field] = this.get(kind, field).filter(x => x !== value);
  }

  select(kind, field, value) {
    this.deselect(kind, field, value);
    this.get(kind, field).push(value);
  }

  clear(kind, field) {
    this.selected[kind][field] = [];
    this.update(kind);
  }

  toggle(kind, field, value) {
    if (this.isSelected(kind, field, value)) {
      this.deselect(kind, field, value);
    } else {
      this.select(kind, field, value);
    }
    this.update(kind);
  }
}
