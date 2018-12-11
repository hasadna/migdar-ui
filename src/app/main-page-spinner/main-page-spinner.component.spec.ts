import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageSpinnerComponent } from './main-page-spinner.component';

describe('MainPageSpinnerComponent', () => {
  let component: MainPageSpinnerComponent;
  let fixture: ComponentFixture<MainPageSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainPageSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
