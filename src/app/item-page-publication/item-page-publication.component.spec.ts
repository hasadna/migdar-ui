import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPagePublicationComponent } from './item-page-publication.component';

describe('ItemPagePublicationComponent', () => {
  let component: ItemPagePublicationComponent;
  let fixture: ComponentFixture<ItemPagePublicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemPagePublicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPagePublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
