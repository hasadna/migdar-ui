import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, debounceTime, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = 'https://yodaat.org';

  public results = new BehaviorSubject<any[]>([]);
  private terms = new Subject<any>();
  params: any;

  constructor(private http: HttpClient) {
    this.terms.pipe(
      debounceTime(300),
      switchMap((params) => this.fetch(params.term, params.count, params.offset))
    ).subscribe((results) => {
      this.results.next(this.results.getValue().concat(results));
    });
  }

  search(term) {
    if (this.params && this.params.term === term) {
      return;
    }
    this.results.next([]);
    this.params = {
      term: term,
      offset: 0,
    };
    this.terms.next(this.params);
  }

  searchMore(): any {
    this.params.offset += 10;
    this.terms.next(this.params);
  }

  clearSearch(): any {
    this.results.next([]);
  }

  fetch(term?, count?, offset?) {
    let params = '';
    if (term) { params += `&q=${encodeURIComponent(term)}`; }
    if (count) { params += `&size=${count}`; }
    if (offset) { params += `&offset=${offset}`; }
    params += `&dont_highlight=${encodeURIComponent('*')}`;
    if (params.length > 0) {
      params = '?' + params.slice(1);
    }
    return this.http.get(`${this.url}/search/all${params}`)
              .pipe(
                map((result: any) => {
                  console.log('got results for', term);
                  return result.search_results.map((item) => Object.assign(item.source, {__type: item.type}));
                }),
              );
  }

  document(doc_id: string) {
    return this.http.get(`${this.url}/get/${doc_id}`);
  }

}
