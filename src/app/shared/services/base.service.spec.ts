import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { BaseService } from "./base.service";

describe("BaseService", () => {
  let service: BaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(BaseService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
