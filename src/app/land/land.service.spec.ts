import { TestBed } from '@angular/core/testing';

import { LandService } from './land.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LandService', () => {
  let service: LandService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(LandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
