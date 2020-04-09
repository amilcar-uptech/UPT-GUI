import { TestBed } from '@angular/core/testing';

import { StEvaluationService } from './st-evaluation.service';

describe('StEvaluationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StEvaluationService = TestBed.get(StEvaluationService);
    expect(service).toBeTruthy();
  });
});
