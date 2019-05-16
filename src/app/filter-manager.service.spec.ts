import { TestBed } from '@angular/core/testing';

import { FilterManagerService } from './filter-manager.service';

describe('FilterManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilterManagerService = TestBed.get(FilterManagerService);
    expect(service).toBeTruthy();
  });
});
