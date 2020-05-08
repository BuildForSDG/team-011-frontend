import { TestBed } from '@angular/core/testing';

import { LandService } from './land.service';

describe('LandService', () => {
  let service: LandService;

  // beforeEach(async(() => {
  //   landComponent = new LandComponent(service, route);
  //   TestBed.configureTestingModule({
  //     declarations: [LandComponent],
  //     imports: [RouterTestingModule],
  //     providers: [LandService],
  //   }).compileComponents();
  // }));
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
