import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderLangSelectorComponent } from './header-lang-selector.component';

describe('HeaderLangSelectorComponent', () => {
  let component: HeaderLangSelectorComponent;
  let fixture: ComponentFixture<HeaderLangSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderLangSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderLangSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
