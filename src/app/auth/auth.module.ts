import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { ComponentsModule } from '../components/components.module';
import { ErrorHandlerService } from '../shared/handlers/error-handler.service';
import { AuthComponent } from './auth.component';
import { AuthRouting } from './auth.routing';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { EmailVerifyComponent } from './email-verify/email-verify.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, AuthComponent, EmailVerifyComponent],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ComponentsModule,
    AuthRouting,
    ReactiveFormsModule,
    NgxTrimDirectiveModule,
  ],
  providers: [ErrorHandlerService],
})
export class AuthModule {}
