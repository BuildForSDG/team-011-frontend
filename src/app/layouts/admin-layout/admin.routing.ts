import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { UserProfileComponent } from 'src/app/user-profile/user-profile.component';
import { LandComponent } from 'src/app/land/land.component';

const routes: Routes = [
  { path: 'home', component: DashboardComponent },
  { path: 'land', component: LandComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRouting {}
