import { TestBed } from '@angular/core/testing';

import { BottommerService } from './bottommer.service';

describe('BottommerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BottommerService = TestBed.get(BottommerService);
    expect(service).toBeTruthy();
  });
});
