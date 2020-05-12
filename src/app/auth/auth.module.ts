import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgxTrimDirectiveModule,
  ],
  providers: [],
})
export class AuthModule {}
