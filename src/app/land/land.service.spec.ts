import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";

import { LandService } from "./land.service";

describe("LandService", () => {
  let service: LandService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule, HttpClientTestingModule]
    });
    service = TestBed.inject(LandService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
