import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPageSearchResultsComponent } from './item-page-search-results.component';

describe('ItemPageSearchResultsComponent', () => {
  let component: ItemPageSearchResultsComponent;
  let fixture: ComponentFixture<ItemPageSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemPageSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPageSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
