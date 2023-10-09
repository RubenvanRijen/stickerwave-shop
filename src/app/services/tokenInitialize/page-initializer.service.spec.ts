import { TestBed } from '@angular/core/testing';

import { TokenInitializerService } from './page-initializer.service';

describe('AppInitializerServiceService', () => {
  let service: TokenInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
