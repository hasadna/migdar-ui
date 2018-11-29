import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonOverlayComponent } from './common-overlay.component';

describe('CommonOverlayComponent', () => {
  let component: CommonOverlayComponent;
  let fixture: ComponentFixture<CommonOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
