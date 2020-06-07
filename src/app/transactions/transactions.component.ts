import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStoreService } from '@shared/services/local-store.service';
import { NotifyService } from '@shared/services/notify.service';
import { Observable, throwError } from 'rxjs';
import { catchError, share, tap } from 'rxjs/operators';

import { AuthService, CurrentUser } from '../auth/auth.service';
import { LandDto, LandRequestStatus, LandStatus, PagedRes, ReqDto } from '../land/land.dto';
import { LandService, CreatPaymentInput } from '../land/land.service';
import { environment } from '../../environments/environment';
import { PaystackOptions } from 'angular4-paystack';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  farmerReqs$: Observable<PagedRes<ReqDto>>;
  cachedPagedLandDto: PagedRes<LandDto>;
  lands$: Observable<PagedRes<LandDto>>;
  farmers$: Observable<PagedRes<ReqDto>>;
  acceptedReqId: string;
  isReqSelected = false;
  selectedRequestId: string;
  LandStatus = LandStatus;
  LandRequestStatus = LandRequestStatus;
  private inViewLandIndex: number;
  currentUser: CurrentUser;
  cachedPagedReqDto: PagedRes<ReqDto>;

  // Paystack
  paystackPublicKey = environment.paystackPublicKey;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private authService: AuthService,
    private landService: LandService,
    private localStore: LocalStoreService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.localStore.disableCaching();
    this.farmerReqs$ = this.landService.getFarmerRequests({ skip: 0, limit: 100 }).pipe(
      share(),
      tap(res => {
        this.cachedPagedReqDto = res;
      })
    );
    this.lands$ = this.landService.getLands({ skip: 0, limit: 0 }).pipe(
      share(),
      tap(res => {
        this.cachedPagedLandDto = res;
      })
    );
  }

  onClickMoreBtn(land: LandDto, content: any) {
    NotifyService.dismissAll();
    this.modalService.open(content, { size: 'lg', centered: true });
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
      NotifyService.notify({
        from: 'top',
        align: 'right',
        message: 'Request accepted',
        notifyType: 'success',
        icon: 'check',
        delay: 3
      });
    });
  }

  onPaymentInit = (reqId: string) => (this.selectedRequestId = reqId);
  onPaymentCancel = () => {
    // quickly refresh the page
    this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/dashboard/transactions']);
    });
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
      NotifyService.notify({
        from: 'top',
        align: 'right',
        title: 'Congratulations!',
        message: 'You are now the occupant of the land',
        notifyType: 'success',
        icon: 'check',
        delay: 3
      });
    });
  };

  //#region Helpers
  filerAuctionType = (lands: LandDto[], auctionType: 'Rent' | 'Lease') =>
    lands && lands.filter(x => x.auctionType === auctionType);
  filerAuctionTypeRequest = (reqs: ReqDto[], auctionType: 'Rent' | 'Lease') =>
    reqs && reqs.filter(x => x.landId.auctionType === auctionType);
  generatePaystackOpts = (req: ReqDto): PaystackOptions => {
    const rand = Math.ceil(Math.random() * 10e10);
    const prefix = 'REF-PAYSTACK';
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
      channels: ['bank', 'card'],
      ref
    };
  };
  onReqChange = (reqId: string) => {
    this.acceptedReqId = reqId;
    this.isReqSelected = true;
  };
  checkReqApprovalStatus = (reqs: ReqDto[]) => reqs.find(x => x.status === LandRequestStatus.Approved);
  //#endregion
}
