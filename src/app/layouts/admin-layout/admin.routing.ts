import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from '../../../app/dashboard/dashboard.component';
import { LandComponent } from '../../../app/land/land.component';
import { MarketplaceComponent } from '../../../app/marketplace/marketplace.component';
import { UserProfileComponent } from '../../../app/user-profile/user-profile.component';
import { TransactionsComponent } from 'src/app/transactions/transactions.component';

const routes: Routes = [
  { path: 'home', component: DashboardComponent },
  { path: 'marketplace', component: MarketplaceComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'lands', component: LandComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRouting {}
