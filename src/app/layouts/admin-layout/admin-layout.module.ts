import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DashboardComponent } from '../../../app/dashboard/dashboard.component';
import { UserProfileComponent } from '../../../app/user-profile/user-profile.component';
import { AdminLayoutRouting } from './admin.routing';
import { LandComponent } from 'src/app/land/land.component';

@NgModule({
  declarations: [DashboardComponent, UserProfileComponent, LandComponent],
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
    MatTooltipModule
  ]
})
export class AdminLayoutModule {}
