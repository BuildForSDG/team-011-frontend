import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DashboardComponent } from "../../../app/dashboard/dashboard.component";
import { LandComponent } from "../../../app/land/land.component";
import { MarketplaceComponent } from "../../../app/marketplace/marketplace.component";
import { TransactionsComponent } from "../../transactions/transactions.component";

const routes: Routes = [
  { path: "home", component: DashboardComponent },
  { path: "marketplace", component: MarketplaceComponent },
  { path: "transactions", component: TransactionsComponent },
  { path: "lands", component: LandComponent },
  {
    path: "account",
    children: [
      {
        path: "",
        loadChildren: () => import("../../account/account.module").then(m => m.AccountModule)
      }
    ]
  },
  { path: "", redirectTo: "home", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRouting {}
