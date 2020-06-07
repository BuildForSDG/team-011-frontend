import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Angular4PaystackModule } from 'angular4-paystack';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { DashboardComponent } from '../../../app/dashboard/dashboard.component';
import { UserProfileComponent } from '../../../app/user-profile/user-profile.component';
import { environment } from '../../../environments/environment';
import { LandComponent } from '../../land/land.component';
import { MarketplaceComponent } from '../../marketplace/marketplace.component';
import { TransactionsComponent } from '../../transactions/transactions.component';
import { AdminLayoutRouting } from './admin.routing';

@NgModule({
  declarations: [DashboardComponent, UserProfileComponent, LandComponent, MarketplaceComponent, TransactionsComponent],
  imports: [
    CommonModule,
    AdminLayoutRouting,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    NgxPaginationModule,
    NgxSkeletonLoaderModule,
    Angular4PaystackModule.forRoot(environment.paystackPublicKey)
  ]
})
export class AdminLayoutModule {}
