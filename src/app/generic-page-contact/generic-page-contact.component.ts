import { Location } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-generic-page-contact',
  templateUrl: './generic-page-contact.component.html',
  styleUrls: ['./generic-page-contact.component.less']
})
export class GenericPageContactComponent implements OnInit {

  selected = 'add';

  @ViewChild('fullName') fullName: ElementRef;
  @ViewChild('emailAddress') emailAddress: ElementRef;
  @ViewChild('phoneNum') phoneNum: ElementRef;
  @ViewChild('organization') organization: ElementRef;
  @ViewChild('itemLink') itemLink: ElementRef;
  @ViewChild('requestBody') requestBody: ElementRef;

  canSend = null;
  wasSent = false;
  wasSentFade = false;

  constructor(private http: HttpClient, private location: Location) { }

  ngOnInit() {
    this.canSend = null;
  }

  val(x) {
    return (x && x.nativeElement && x.nativeElement.value) || '';
  }

  clearAll() {
    this.fullName.nativeElement.value = '';
    this.emailAddress.nativeElement.value = '';
    this.phoneNum.nativeElement.value = '';
    this.organization.nativeElement.value = '';
    this.itemLink.nativeElement.value = '';
    this.requestBody.nativeElement.value = '';
  }

  validate() {
    const emailAddress: HTMLInputElement = this.emailAddress.nativeElement;
    emailAddress.checkValidity();
    this.canSend = !!this.val(this.fullName) && !!this.val(this.emailAddress) && emailAddress.validity.valid;
  }

  rawBody() {
    const fullName = this.val(this.fullName);
    const emailAddress = this.val(this.emailAddress);
    const phoneNum = this.val(this.phoneNum);
    const organization = this.val(this.organization);
    const itemLink = this.val(this.itemLink);
    const requestBody = this.val(this.requestBody);
    const body = `שם מלא: ${fullName}
כתובת אימייל: ${emailAddress}
מספר טלפון: ${phoneNum}
ארגון: ${organization}
קישור לפריט (אם רלוונטי): ${itemLink}
תוכן הבקשה:
${requestBody}
`;
    return body;
  }

  rawSubject() {
    const subject = this.selected === 'help' ? 'סיוע באיתור מידע' :
    (this.selected === 'add' ? 'הוספת חומרים למאגר' :
        'שירותים נוספים');
    return subject;
  }

  send() {
    if (!this.canSend) {
      return;
    }
    const body = {
      subject: this.rawSubject(),
      body: this.rawBody()
    };
    this.http.post('/contact', body)
        .pipe(
          catchError((err) => of({err}))
        )
        .subscribe(() => {
          console.log('DSAAS');
          this.wasSent = true;
          this.clearAll();
          setTimeout(() => {
            this.wasSentFade = true;
          }, 100);
          setTimeout(() => {
            this.wasSent = false;
            this.wasSentFade = false;
          }, 7000);
        });
  }
}
