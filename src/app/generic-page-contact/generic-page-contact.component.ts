import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-generic-page-contact',
  templateUrl: './generic-page-contact.component.html',
  styleUrls: ['./generic-page-contact.component.less']
})
export class GenericPageContactComponent implements OnInit {

  selected = 'help';

  @ViewChild('fullName') fullName: ElementRef;
  @ViewChild('phoneNum') phoneNum: ElementRef;
  @ViewChild('organization') organization: ElementRef;
  @ViewChild('itemLink') itemLink: ElementRef;
  @ViewChild('requestBody') requestBody: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  val(x) {
    return (x && x.nativeElement && x.nativeElement.value) || '';
  }

  body() {
    const fullName = this.val(this.fullName);
    const phoneNum = this.val(this.phoneNum);
    const organization = this.val(this.organization);
    const itemLink = this.val(this.itemLink);
    const requestBody = this.val(this.requestBody);
    const body = `שם מלא: ${fullName}
מספר טלפון: ${phoneNum}
ארגון: ${organization}
קישור לפריט (אם רלוונטי): ${itemLink}
תוכן הבקשה:
${requestBody}
`;
    return encodeURIComponent(body);
  }

  subject() {
    const subject = this.selected === 'help' ? 'סיוע באיתור מידע' :
    (this.selected === 'add' ? 'הוספת חומרים למאגר' :
        'שירותים נוספים');
    return encodeURIComponent(subject);
  }

  mailto() {
    return `mailto:info@yodaat.org?subject=${this.subject()}&body=${this.body()}`;
  }
}
