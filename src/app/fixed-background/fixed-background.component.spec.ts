import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedBackgroundComponent } from './fixed-background.component';

describe('FixedBackgroundComponent', () => {
  let component: FixedBackgroundComponent;
  let fixture: ComponentFixture<FixedBackgroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedBackgroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
