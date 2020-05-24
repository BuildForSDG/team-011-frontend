import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { UserProfileComponent } from 'src/app/user-profile/user-profile.component';
import { MapsComponent } from 'src/app/maps/maps.component';

const routes: Routes = [
  { path: 'home', component: DashboardComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'maps', component: MapsComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminLayoutRouting {}
