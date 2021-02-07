import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { Subscription } from 'rxjs';
import { I18nService } from '../i18n.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-card-share-page',
  templateUrl: './card-share-page.component.html',
  styleUrls: ['./card-share-page.component.less']
})
export class CardSharePageComponent implements OnInit, OnDestroy {

  kind: any = null;
  document: any = null;
  routeSubs: Subscription;

  constructor(private route: ActivatedRoute, private api: ApiService, public _: I18nService) {
    localStorage.setItem('cookie_consented', 'yes');
    this.routeSubs = this.route.url.pipe(
      map((segments) => {
            const parts = [];
            for (const segment of segments) {
              parts.push(segment.path);
            }
            this.kind = parts[0];
            return parts.join('/');
          }),
      switchMap((doc_id) => {
        return this.api.document(doc_id);
      })
    ).subscribe((document) => {
      console.log('got document', document);
      document.__type = {
        org: 'orgs',
        dataset: 'datasets',
        publications: 'publications'
      }[this.kind];
      this.document = document;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
