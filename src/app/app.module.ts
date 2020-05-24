import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { HomeComponent } from './home/home.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ComponentsModule } from './components/components.module';

@NgModule({
  declarations: [AppComponent, AdminLayoutComponent, HomeComponent],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    RouterModule,
    AppRouting,
    // AuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
