import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { BottommerService } from '../bottommer.service';
import { I18nService } from '../i18n.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

declare const window: any;


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent implements OnInit, OnDestroy {

  checkerObs = new Subject<any>();
  subscription: Subscription;

  constructor(private bottommer: BottommerService,
              public _: I18nService) {
  }

  ngOnInit() {
    this.subscription = this.checkerObs.pipe(
      debounceTime(1000)
    ).subscribe(() => {
      if (window.innerHeight + window.pageYOffset + 300 > window.document.body.scrollHeight) {
        this.bottommer.emit();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    this.checkerObs.next(true);
  }
}
