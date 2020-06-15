import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { environment } from "@shared/environment";
import { SocketIoModule } from "ngx-socket-io";

import { NotifyService } from "./notify.service";

describe("NotifyService", () => {
  let service: NotifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        SocketIoModule.forRoot({ url: environment.apiUrl, options: {} })
      ]
    });
    service = TestBed.inject(NotifyService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
