import { environment } from "@shared/environment";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { AppRouting } from "./app.routing";
import { AuthModule } from "./auth/auth.module";
import { ComponentsModule } from "./components/components.module";
import { HomeComponent } from "./home/home.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { httpInterceptorProviders } from "./shared/services/http-interceptors";
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";

const config: SocketIoConfig = { url: environment.apiUrl, options: {} };

@NgModule({
  declarations: [AppComponent, AdminLayoutComponent, HomeComponent],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,

    RouterModule,
    AppRouting,
    AuthModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {}
