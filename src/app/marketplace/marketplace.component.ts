import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LocalStoreService } from "@shared/services/local-store.service";
import { Toast } from "@shared/services/toast";
import { PaginationInstance } from "ngx-pagination";
import { Observable } from "rxjs";
import { share, tap } from "rxjs/operators";

import { AuthService, CurrentUser } from "../auth/auth.service";
import { LandDto, LandStatus, PagedRes } from "../land/land.dto";
import { LandService } from "../land/land.service";

@Component({
  selector: "app-marketplace",
  templateUrl: "./marketplace.component.html",
  styleUrls: ["./marketplace.component.css"]
})
export class MarketplaceComponent implements OnInit {
  lands$: Observable<PagedRes<LandDto>>;
  pageConfig: PaginationInstance = {
    itemsPerPage: 8,
    currentPage: 1
    // totalItems: 0,
    // id: 'custom'
  };
  currentUser: CurrentUser;
  landInfo: LandDto;
  LandStatus = LandStatus;
  paystackRef: string;
  cachedPagedLandDto: PagedRes<LandDto>;
  constructor(
    private landService: LandService,
    private modalService: NgbModal,
    private authService: AuthService,
    private localStore: LocalStoreService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.localStore.disableCaching();
    this.lands$ = this.landService
      .getLands({ skip: 0, limit: 8, query: { status: { $ne: LandStatus.Occupied } } })
      .pipe(
        share(),
        tap(res => {
          this.cachedPagedLandDto = res;
        })
      );
  }

  onClickLandInfoBtn = (landInfo: any, land: LandDto) => {
    this.landInfo = land;
    this.modalService.open(landInfo, { centered: true });
  };
  onClickLandSendReqBtn = (land: LandDto) => {
    Toast.dismissAll();
    this.landService.createLandRequest(land.id).subscribe(res => {
      const index = this.cachedPagedLandDto.items.indexOf(land);
      this.cachedPagedLandDto.items[index].requests.push({ createdBy: this.currentUser.userId, ...res });
      Toast.notify({
        from: "top",
        align: "right",
        message: "Request sent to Landowner",
        notifyType: "success",
        icon: "send",
        delay: 3
      });
    });
  };
  checkLandRequestStatus = (requests: any) => {
    const result = requests.filter((request: any) => request.createdBy === this.currentUser.userId);
    return result.length > 0;
  };
}
