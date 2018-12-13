import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationsPageHeaderComponent } from './publications-page-header.component';

describe('PublicationsPageHeaderComponent', () => {
  let component: PublicationsPageHeaderComponent;
  let fixture: ComponentFixture<PublicationsPageHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicationsPageHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationsPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
