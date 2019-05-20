import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, debounceTime, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = 'https://api.yodaat.org';

  public results = new BehaviorSubject<any[]>([]);
  private terms = new Subject<any>();
  params: any;

  constructor(private http: HttpClient) {
    this.terms.pipe(
      debounceTime(300),
      switchMap((params) => {
        return this.fetch(params.types,
                          params.term,
                          params.count,
                          params.offset,
                          params.filters)
                    .pipe(
                      map((results) => {
                        return {
                          results: results,
                          params: params
                        };
                      })
                    );
        }
      )
    ).subscribe((val) => {
      let results = val.results;
      const params = val.params;
      this.params = params;
      console.log('GOT PARAMS', params);
      console.log('GOT RESULTS', results);
      let current = this.results.getValue();
      if (params.offset === 0) {
        current = [];
        this.results.next(current);
      }
      results = current.concat(results);
      this.params.offset += results.length;
      this.results.next(results);
    });
  }

  search(term, types?, filters?) {
    if (this.params &&
        this.params.term === term &&
        this.params.types === types &&
        this.params.filters === filters) {
      return;
    }
    this.results.next([]);
    this.params = {
      types: types || 'all',
      term: term,
      offset: 0,
      filters: filters,
    };
    this.terms.next(Object.assign({}, this.params));
  }

  searchTerm(term) {
    this.search(term,
                this.params ? this.params.types : null,
                this.params ? this.params.filters : null);
  }

  searchParams(types?, filters?) {
    this.search(this.params ? this.params.term : null, types, filters);
  }

  searchMore(): any {
    this.terms.next(Object.assign({}, this.params));
  }

  clearSearch(): any {
    this.results.next([]);
  }

  fetch(types, term?, count?, offset?, filters?) {
    let params = '';
    console.log('FETCHING', types, term, offset, filters);
    if (count) { params += `&size=${count}`; }
    if (offset) { params += `&offset=${offset}`; }
    if (filters) { params += `&filter=${encodeURIComponent(JSON.stringify(filters))}`; }
    params += `&dont_highlight=${encodeURIComponent('*')}`;
    if (params.length > 0) {
      params = '?' + params.slice(1);
    }
    if (term) { params = `/${encodeURIComponent(term)}` + params; }
    return this.http.get(`${this.url}/search/${types}${params}`)
              .pipe(
                map((result: any) => result.search_results.map((item) => Object.assign(item.source, {__type: item.type}))),
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
