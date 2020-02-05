import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, debounceTime, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = 'https://api.yodaat.org';

  constructor(private http: HttpClient) {
  }

  fetch(types, term?, count?, offset?, filters?, sortOrder?) {
    let params = '';
    console.log('FETCHING', types, term, offset, filters);
    if (term) { params += `&q=${encodeURIComponent(term)}`; }
    if (count) { params += `&size=${count}`; }
    if (offset) { params += `&offset=${offset}`; }
    if (filters) { params += `&filter=${encodeURIComponent(JSON.stringify(filters))}`; }
    if (sortOrder) { params += `&order=${sortOrder}`; }
    if (params.length > 0) {
      params = '?' + params.slice(1);
    }
    return this.http.get(`${this.url}/search/${types}${params}`)
              .pipe(
                map((result: any) => {
                  let results = [];
                  if (result.search_results) {
                    results = result.search_results.map((item) => Object.assign(item.source, {__type: item.type}));
                  }
                  let total = 0;
                  if (result.searcg_counts) {
                    total = result.search_counts._current.total_overall;
                  }
                  return {results, total};
                }),
              );
  }

  count(term?, config?) {
    let params = '';
    console.log('COUNTING', term, config);
    if (term) { params += `&q=${encodeURIComponent(term)}`; }
    if (config) { params += `&config=${encodeURIComponent(JSON.stringify(config))}`; }
    if (params.length > 0) {
      params = '?' + params.slice(1);
    }
    return this.http.get(`${this.url}/search/count${params}`)
              .pipe(
                map((result: any) => result.search_counts),
              );
  }

  document(doc_id: string) {
    return this.http.get(`${this.url}/get/${doc_id}`)
                    .pipe(map((x: any) => {
                      x.value.doc_id = x.value.doc_id || doc_id;
                      return x.value;
                    }));
  }

}
