import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ErrorHandlerService } from '../shared/handlers/error-handler.service';

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgxTrimDirectiveModule,
  ],
  providers: [ErrorHandlerService],
})
export class AuthModule {}
