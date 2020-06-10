import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";

import { AuthService } from "../auth/auth.service";
import { AccountService } from "./account.service";

describe("AccountService", () => {
  let service: AccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule, HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AccountService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
