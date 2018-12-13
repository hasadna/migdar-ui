import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPageHeaderComponent } from './item-page-header.component';

describe('ItemPageHeaderComponent', () => {
  let component: ItemPageHeaderComponent;
  let fixture: ComponentFixture<ItemPageHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemPageHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
