import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultCardPublicationComponent } from './result-card-publication.component';

describe('ResultCardPublicationComponent', () => {
  let component: ResultCardPublicationComponent;
  let fixture: ComponentFixture<ResultCardPublicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultCardPublicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultCardPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
