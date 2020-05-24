import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ComponentsModule } from '../components/components.module';
import { AuthComponent } from './auth.component';
import { AuthRouting } from './auth.routing';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, AuthComponent],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ComponentsModule,
    AuthRouting,
    ReactiveFormsModule,
  ],
})
export class AuthModule {}
