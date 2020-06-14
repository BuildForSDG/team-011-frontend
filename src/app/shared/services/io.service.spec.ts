import { TestBed } from "@angular/core/testing";
import { environment } from "@shared/environment";
import { SocketIoModule } from "ngx-socket-io";

import { IoService } from "./io.service";

describe("IoService", () => {
  let service: IoService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [SocketIoModule.forRoot({ url: environment.apiUrl, options: {} })] });
    service = TestBed.inject(IoService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
