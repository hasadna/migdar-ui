import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url = 'https://yodaat.org/search';

  constructor(private http: HttpClient) {}

  fetch(term, count?, offset?) {
    count = count ? count : 10;
    offset = offset ? offset : 0;
    term = encodeURIComponent(term);
    return this.http.get(`${this.url}/all/${term}/1900-01-01/2100-01-01/${count}/${offset}`)
              .pipe(
                map((result: any) => result.search_results.map((item) => Object.assign(item.source, {__type: item.type}))),
              );
  }

}
