import { TestBed } from '@angular/core/testing';

import { AssumptionService } from './assumption.service';

describe('AssumptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssumptionService = TestBed.get(AssumptionService);
    expect(service).toBeTruthy();
  });
});
