import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStoreService } from '@shared/services/local-store.service';
import { PaginationInstance } from 'ngx-pagination';
import { Observable } from 'rxjs';
import { share, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment.prod';
import { AuthService, CurrentUser } from '../auth/auth.service';
import { LandDto, PagedRes } from '../land/land.dto';
import { LandService } from '../land/land.service';
import { NotifyService } from '@shared/services/notify.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {
  lands$: Observable<PagedRes<LandDto>>;
  pageConfig: PaginationInstance = {
    itemsPerPage: 8,
    currentPage: 1
    // totalItems: 0,
    // id: 'custom'
  };
  paystackPublicKey = environment.paystackPublicKey;
  currentUser: CurrentUser;
  landInfo: LandDto;
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
    this.lands$ = this.landService.getLands({ skip: 0, limit: 8 }).pipe(
      share(),
      tap(res => {
        this.cachedPagedLandDto = res;
      })
    );

    this.paystackRef = `ref--${Math.ceil(Math.random() * 10e13)}`;
  }
  paymentInit() {
    this.localStore.disableCaching();

    console.log('payment failed', this.paystackRef);
  }
  onClickPayment(landId: string) {
    console.log('payment failed', this.paystackRef);
  }

  paymentDone(ref: string) {
    //this.title = 'Payment successfull';
    // console.log(this.title, ref);
  }

  paymentCancel() {
    this.localStore.disableCaching();
    console.log('cancelled');
  }
  onClickLandInfoBtn = (landInfo: any, land: LandDto) => {
    this.landInfo = land;
    this.modalService.open(landInfo, { centered: true });
  };
  onClickLandSendReqBtn = (land: LandDto) => {
    NotifyService.dismissAll();
    this.landService.createLandRequest(land.id).subscribe(res => {
      const index = this.cachedPagedLandDto.items.indexOf(land);
      this.cachedPagedLandDto.items[index].requests.push({ createdBy: this.currentUser.userId, ...res });
      NotifyService.notify({
        from: 'top',
        align: 'right',
        message: 'Request sent to Landowner',
        notifyType: 'success',
        icon: 'send',
        delay: 3
      });
    });
  };
  checkLandRequestStatus = (requests: any) => {
    const request = requests.filter((request: any) => request.createdBy === this.currentUser.userId);
    return request.length > 0;
  };
}
