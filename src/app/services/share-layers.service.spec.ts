import { TestBed } from '@angular/core/testing';

import { ShareLayersService } from './share-layers.service';

describe('ShareLayersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareLayersService = TestBed.get(ShareLayersService);
    expect(service).toBeTruthy();
  });
});
