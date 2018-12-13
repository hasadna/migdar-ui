import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.less']
})
export class ItemPageComponent implements OnInit {

  kind: string = null;
  document: any = null;

  constructor(private route: ActivatedRoute, private api: ApiService) {
    route.url.pipe(
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

}
