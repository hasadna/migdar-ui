import { Subject } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { ApiService } from './api.service';


export class SearchManager {
    url = 'https://api.yodaat.org';

    public results = new Subject<any>();
    public totals = new Subject<any>();
    public params: any = {};
    public queue = [];
    private terms = new Subject<any>();

    constructor(private api: ApiService) {
      this.terms.pipe(
        debounceTime(300),
        switchMap((params) => {
          return this.api.fetch(params.types,
                                params.term,
                                params.count,
                                params.offset,
                                params.filters);
        })
      ).subscribe(({results, total}) => {
        console.log('GOT RESULTS', results.length, 'TOTAL:', total);
        for (const result of results) {
            this.results.next(result);
        }
        this.totals.next(total);
        this.params.offset += results.length;
        if (results.length === 0 && this.queue.length > 0) {
          const next = this.queue.shift();
          this.search(next.term, next.types, next.filters);
        }
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

    searchMore(): any {
      this.terms.next(Object.assign({}, this.params));
    }

    newFromFilters(filters) {
      const _search = new SearchManager(this.api);
      _search.search(this.params.term, this.params.types, filters);
      return _search;
    }

    newFromTerm(term) {
      term = term || null;
      console.log('new from term, current', this.params.term, ' new ', term);
      if (term === this.params.term) {
        return this;
      }
      const _search = new SearchManager(this.api);
      _search.search(term, this.params.types);
      return _search;
    }

}
