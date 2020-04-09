import { TestBed } from '@angular/core/testing';

import { UpMiscService } from './up-misc.service';

describe('UpMiscService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpMiscService = TestBed.get(UpMiscService);
    expect(service).toBeTruthy();
  });
});
