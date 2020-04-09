import { TestBed } from '@angular/core/testing';

import { WfsUptService } from './wfs-upt.service';

describe('WfsUptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WfsUptService = TestBed.get(WfsUptService);
    expect(service).toBeTruthy();
  });
});
