import { Component, OnInit } from '@angular/core';
import { FILTERS_CONFIG } from '../constants';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-main-page-spinner',
  templateUrl: './main-page-spinner.component.html',
  styleUrls: ['./main-page-spinner.component.less']
})
export class MainPageSpinnerComponent implements OnInit {

  points = [];
  RADIUS = 172.5;
  // TITLES = ['פמיניזם', 'חברה בישראל', 'תקשורת', 'משפט', 'ביטחון', 'מעגל החיים וזמן', 'דת',
  //           'מדע, טכנולוגיה וסביבה', 'בריאות ומיניות', 'אלימות מגדרית', 'משפחה', 'תרבות וספורט',
  //           'עוצמה', 'עוני', 'כלכלה ושוק העבודה', 'השכלה'];
  TITLES = FILTERS_CONFIG.gender_index[0].options;

  constructor(public _: I18nService) { }

  ngOnInit() {
    for (let i = 0 ; i < 16 ; i++ ) {
      this.points.push({
        i: i,
        x: Math.cos(Math.PI * 2 / 16 * i) * this.RADIUS,
        y: -Math.sin(Math.PI * 2 / 16 * i) * this.RADIUS,
        text: this.TITLES[i]
      });
    }
  }

  rotateLabels() {
    const last = this.points[15].text;
    for (let i = 15 ; i > 0 ; i-- ) {
      this.points[i].text = this.points[i - 1].text;
    }
    this.points[0].text = last;
  }

}
