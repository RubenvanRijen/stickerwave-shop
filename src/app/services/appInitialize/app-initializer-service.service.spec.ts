import { TestBed } from '@angular/core/testing';

import { AppInitializerServiceService } from './app-initializer-service.service';

describe('AppInitializerServiceService', () => {
  let service: AppInitializerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppInitializerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
