import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultCardLayoutComponent } from './result-card-layout.component';

describe('ResultCardLayoutComponent', () => {
  let component: ResultCardLayoutComponent;
  let fixture: ComponentFixture<ResultCardLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultCardLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultCardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
