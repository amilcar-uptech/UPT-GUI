import { TestBed } from '@angular/core/testing';

import { DataCopyService } from './data-copy.service';

describe('DataCopyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataCopyService = TestBed.get(DataCopyService);
    expect(service).toBeTruthy();
  });
});
