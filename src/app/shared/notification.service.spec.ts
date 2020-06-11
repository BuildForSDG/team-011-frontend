import { TestBed } from "@angular/core/testing";

import { NotifyService } from "./notification.service";

describe("NotificationService", () => {
  let service: NotifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotifyService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
