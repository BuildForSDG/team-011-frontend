import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmailVerifyComponent } from './email-verify/email-verify.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'email-verification', component: EmailVerifyComponent },
  { path: 'signup', component: SignupComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class AuthRouting {}
