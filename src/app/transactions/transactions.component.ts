import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PagedRes } from "@shared/DTOs/paged-response.dto";
import { environment } from "@shared/environment";
import { LocalStoreService } from "@shared/services/local-store.service";
import { NotifyService } from "@shared/services/notify.service";
import { Toast } from "@shared/services/toast";
import { PaystackOptions } from "angular4-paystack";
import { Observable, throwError } from "rxjs";
import { catchError, share, tap } from "rxjs/operators";

import { AuthService, CurrentUser } from "../auth/auth.service";
import { LandReqDto, LandRequestStatus, LandStatus } from "../land/DTOs/land-request.dto";
import { LandDto } from "../land/DTOs/land.dto";
import { CreatPaymentInput, LandService } from "../land/land.service";

@Component({
  selector: "app-transactions",
  templateUrl: "./transactions.component.html",
  styleUrls: ["./transactions.component.css"]
})
export class TransactionsComponent implements OnInit {
  farmerReqs$: Observable<PagedRes<LandReqDto>>;
  cachedPagedLandDto: PagedRes<LandDto>;
  lands$: Observable<PagedRes<LandDto>>;
  farmers$: Observable<PagedRes<LandReqDto>>;
  acceptedReqId: string;
  isReqSelected = false;
  selectedRequestId: string;
  LandStatus = LandStatus;
  LandRequestStatus = LandRequestStatus;
  private inViewLandIndex: number;
  currentUser: CurrentUser;
  cachedPagedReqDto: PagedRes<LandReqDto>;

  // Paystack
  paystackPublicKey = environment.paystackPublicKey;

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private landService: LandService,
    private notifyService: NotifyService,
    private localStore: LocalStoreService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.notifyService.deleteNotifications().subscribe();
    this.localStore.disableCaching();
    const role = this.currentUser?.role;
    let query = {};
    let countQuery = {};

    if (role === "Landowner") {
      query = { createdBy: this.currentUser.userId };
      countQuery = query;
    }
    this.farmerReqs$ = this.landService.getFarmerRequests({ skip: 0, limit: 100 }).pipe(
      share(),
      tap(res => {
        this.cachedPagedReqDto = res;
      })
    );
    this.lands$ = this.landService.getLands({ skip: 0, limit: 0, query, countQuery }).pipe(
      share(),
      tap(res => {
        this.cachedPagedLandDto = res;
      })
    );
  }

  onClickMoreBtn(land: LandDto, content: any) {
    Toast.dismissAll();
    this.modalService.open(content, { size: "lg", centered: true });
    this.localStore.disableCaching();

    this.inViewLandIndex = this.cachedPagedLandDto.items.indexOf(land);
    this.farmers$ = this.landService.getRequestsToLandowner({ skip: 0, limit: 20, query: { landId: land.id } }).pipe(
      catchError(err => {
        this.modalService.dismissAll();
        return throwError(err);
      }),
      share()
    );
  }
  onClickAcceptBtn() {
    this.modalService.dismissAll();
    this.isReqSelected = false;
    this.landService.updateRequestsToLandowner(this.acceptedReqId, LandRequestStatus.Approved).subscribe(res => {
      this.cachedPagedLandDto.items[this.inViewLandIndex].status = res.landId.status;
      Toast.notify({
        from: "top",
        align: "right",
        message: "Request accepted",
        notifyType: "success",
        icon: "check",
        delay: 3
      });
    });
  }

  onPaymentInit = (reqId: string) => (this.selectedRequestId = reqId);
  onPaymentCancel = () => {
    this.ngOnInit();
  };
  onPaymentDone = (metadata: any) => {
    const input: CreatPaymentInput = {
      metadata,
      requestId: this.selectedRequestId
    };
    this.landService.savePaymentDetails(input).subscribe(res => {
      const index = this.cachedPagedReqDto.items.findIndex(x => x.id === input.requestId);
      this.cachedPagedReqDto.items[index].landId.status = LandStatus.Occupied;
      this.selectedRequestId = null;
      Toast.notify({
        from: "top",
        align: "right",
        title: "Congratulations!",
        message: "You are now the occupant of the land",
        notifyType: "success",
        icon: "check",
        delay: 3
      });
    });
  };

  //#region Helpers
  filerAuctionType = (lands: LandDto[], auctionType: "Rent" | "Lease") =>
    lands?.filter(x => x.auctionType === auctionType);
  filerAuctionTypeRequest = (reqs: LandReqDto[], auctionType: "Rent" | "Lease") =>
    reqs?.filter(x => x.landId.auctionType === auctionType);
  generatePaystackOpts = (req: LandReqDto): PaystackOptions => {
    const rand = Math.ceil(Math.random() * 10e10);
    const prefix = "REF-PAYSTACK";
    const ref =
      (req.landId.id && `${prefix}-${req.landId.id}-${req.id}-${rand}`.toUpperCase()) ||
      `${prefix}-${rand}`.toUpperCase();
    const user = this.currentUser;
    return {
      amount: req.landId.price * 100,
      email: this.currentUser.email,
      metadata: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userRole: user.role,
        landReqId: req?.id
      },
      channels: ["bank", "card"],
      ref
    };
  };
  onReqChange = (reqId: string) => {
    this.acceptedReqId = reqId;
    this.isReqSelected = true;
  };
  checkReqApprovalStatus = (reqs: LandReqDto[]) => reqs.find(x => x.status === LandRequestStatus.Approved);
  //#endregion
}
