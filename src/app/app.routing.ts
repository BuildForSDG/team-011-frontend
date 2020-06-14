import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthComponent } from "./auth/auth.component";
import { HomeComponent } from "./home/home.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoggedInGuard } from "@shared/guards/logged-in.guard";
import { AuthGuard } from "@shared/guards/auth.guard";

const routes: Routes = [
  { path: "", component: HomeComponent, canActivate: [LoggedInGuard] },

  {
    path: "account",
    component: AuthComponent,
    canActivate: [LoggedInGuard],
    children: [
      {
        path: "",
        loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule)
      }
    ]
  },
  {
    path: "dashboard",
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        loadChildren: () => import("./layouts/admin-layout/admin-layout.module").then(m => m.AdminLayoutModule)
      }
    ]
  },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      onSameUrlNavigation: "reload"
    })
  ],
  exports: [RouterModule]
})
export class AppRouting {}
