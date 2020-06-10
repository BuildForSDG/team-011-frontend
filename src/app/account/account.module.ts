import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgxPaginationModule } from "ngx-pagination";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";

import { AccountRouting } from "./account.routing";
import { ProfileComponent } from "./profile/profile.component";
import { SettingComponent } from "./setting/setting.component";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [SettingComponent, ProfileComponent],
  imports: [
    CommonModule,
    AccountRouting,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    NgxPaginationModule,
    NgxSkeletonLoaderModule
  ],
  exports: [SettingComponent, ProfileComponent]
})
export class AccountModule {}
