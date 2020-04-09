import { TestBed } from '@angular/core/testing';

import { LayerSTService } from './layer-st.service';

describe('LayerSTService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LayerSTService = TestBed.get(LayerSTService);
    expect(service).toBeTruthy();
  });
});
