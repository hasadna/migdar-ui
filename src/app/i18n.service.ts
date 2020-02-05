import { Injectable, Inject } from '@angular/core';
import { LOCALE_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class  I18nService {

  ltr = false;

  constructor(@Inject(LOCALE_ID) public locale: string) {
    console.log('LOCALE', locale);
    this.ltr = locale === 'en';
  }

  _(item, field) {
    return item[field + '__' + this.locale] || item[field];
  }

  tags(item) {
    const ret = [];
    const tags = item['tags'] || [];
    const dstTags = item['tags__' + this.locale] || tags;
    for (let i = 0 ; i < tags.length ; i++) {
      const src = tags[i];
      const dst = dstTags[i];
      ret.push({src, dst});
    }
    return ret;
  }

  P(path: string) {
    if (this.locale === 'ar' || this.locale === 'en') {
      return `/${this.locale}${path}`;
    } else {
      return path;
    }
  }
}
