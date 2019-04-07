import { TestBed } from '@angular/core/testing';

import { HeaderStateService } from './header-state.service';

describe('HeaderStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HeaderStateService = TestBed.get(HeaderStateService);
    expect(service).toBeTruthy();
  });
});
