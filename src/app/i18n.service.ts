import { Injectable, Inject } from '@angular/core';
import { LOCALE_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class  I18nService {

  constructor(@Inject(LOCALE_ID) public locale: string) {
    console.log('LOCALE', locale);
  }

  _(item, field) {
    return item[field + '__' + this.locale] || item[field];
  }

  P(path: string) {
    if (this.locale === 'ar' || this.locale === 'en') {
      return `/${this.locale}${path}`;
    } else {
      return path;
    }
  }
}
