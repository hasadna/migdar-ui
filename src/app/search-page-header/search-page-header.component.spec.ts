import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPageHeaderComponent } from './search-page-header.component';

describe('SearchPageHeaderComponent', () => {
  let component: SearchPageHeaderComponent;
  let fixture: ComponentFixture<SearchPageHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPageHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
