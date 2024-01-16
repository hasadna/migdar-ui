import { Component, OnInit, Input, AfterViewInit, ElementRef, OnDestroy, AfterContentInit, AfterContentChecked, AfterViewChecked } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-gender-index-page-browser',
  templateUrl: './gender-index-page-browser.component.html',
  styleUrls: ['./gender-index-page-browser.component.less']
})
export class GenderIndexPageBrowserComponent implements OnInit, OnDestroy {

  @Input() active = null;

  results: any[] = [];
  selected = null;

  observer: IntersectionObserver;

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute, private el: ElementRef) {
  }

  ngOnInit() {
    this.api.fetch('datasets', null, 1000, 0)
      .subscribe(({results, total}) => {
        const gender_index_results = results
            .filter((x) => x.kind === 'Gender Index')
            .sort((a, b) => a.series[0].order_index - b.series[0].order_index);
        this.results = gender_index_results;
        timer(1000).subscribe(() => {
          this.setupObserver();
          this.activatedRoute.fragment.pipe(
            take(1),
          ).subscribe((fragment) => {
            const dimension = fragment;
            if (dimension) {
              const el = this.el.nativeElement as HTMLElement;
              const section = el.querySelector(`app-gender-index-page-browser-section[name="${dimension}"]`);
              if (section) {
                const boundingClientRect = section.getBoundingClientRect();
                const parent = document.scrollingElement;
                parent.scrollTop = boundingClientRect.top + parent.scrollTop - 158;
              }
            }
          });
        });      
      });
    }

  setActive(section) {
    this.active = section;
  }

  setupObserver(): void {
    this.observer = new IntersectionObserver((entries) => {
      let intersectionHeight = -1;
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const entryIntersectionHeight = entry.intersectionRect.height;
          const el: HTMLElement = entry.target as HTMLElement;
          if (entryIntersectionHeight > intersectionHeight) {
            intersectionHeight = entryIntersectionHeight;
            this.setActive(el.getAttribute('name'));
          }
        }
      }
    }, {threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.9, 1]});
    const el = this.el.nativeElement as HTMLElement;
    el.querySelectorAll('app-gender-index-page-browser-section').forEach((section) => {
      this.observer.observe(section);
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.observer = null;
  }
}
