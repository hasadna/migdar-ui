import { Injectable } from '@angular/core';
import { FILTERS_CONFIG, ALLOWED_FIELDS, RANGE_FIELDS } from './constants';
import { Subject, BehaviorSubject, forkJoin } from 'rxjs';
import { ApiService } from './api.service';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FilterManagerService {

  public CONFIG = FILTERS_CONFIG;

  private selected = {};
  public absRange = {};
  public selectedRange = {year__gte: 0, year__lte: 0};

  public updated = new BehaviorSubject<any>({});
  public updateChannel = new Subject<string>();

  constructor(private api: ApiService) {
    forkJoin([
      this.api.fetch(
        'publications', null, 1, 0, {}, 'year'
      ),
      this.api.fetch(
        'publications', null, 1, 0, {}, '-year'
      )
    ]).subscribe((results) => {
      this.absRange = {
        year__gte: results[0].results[0].year,
        year__lte: results[1].results[0].year
      };
      RANGE_FIELDS.forEach((field) => {
        this.selectedRange[field] = this.selectedRange[field] || this.absRange[field];
      });
      console.log('GOT RANGES', this.absRange, this.selectedRange);
    });
    this.updateChannel.pipe(
      debounceTime(100)
    ).subscribe((kind) => {
      this.update(kind);
    })
  }

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
    RANGE_FIELDS.forEach((field) => {
      if (this.selectedRange[field] && this.selectedRange[field] !== this.absRange[field]) {
        filters[field] = this.selectedRange[field];
      }
    });
    this.updated.next(filters);
    return filters;
  }

  updateFrom(kind, filters) {
    this.selected[kind] = {};
    for (const field of Object.keys(filters)) {
      if (ALLOWED_FIELDS.has(field)) {
        this.selected[kind][field] = filters[field];
      }
      if (RANGE_FIELDS.has(field)) {
        this.selectedRange[field] = parseInt(filters[field], 10) || this.absRange[field];
      }
    }
    console.log('updateFrom', kind, filters, this.selectedRange);
    this.update(kind);
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

  clearKind(kind) {
    this.selected[kind] = {};
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

  yearRange(kind, range) {
    this.selectedRange = {
      year__gte: range[0],
      year__lte: range[1]
    };
    this.updateChannel.next(kind);
  }
}
