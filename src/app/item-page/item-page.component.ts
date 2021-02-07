import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { Subscription } from 'rxjs';

@AutoUnsubscribe()
@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.less']
})
export class ItemPageComponent implements OnInit, OnDestroy {

  kind: string = null;
  document: any = null;
  routeSubs: Subscription;

  constructor(private route: ActivatedRoute, private api: ApiService) {
    this.routeSubs = route.url.pipe(
      map((segments) => {
            const parts = [];
            for (const segment of segments) {
              parts.push(segment.path);
            }
            this.kind = parts[0];
            return parts.join('/');
          }),
      switchMap((doc_id) => {
        return api.document(doc_id);
      })
    ).subscribe((document) => {
      this.document = document;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
