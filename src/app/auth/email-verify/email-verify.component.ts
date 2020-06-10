import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Notiflix from "notiflix-angular";

import { NotifyService } from "../../shared/services/notify.service";
import { AuthService } from "../auth.service";
import { authConstants } from "../constants";

@Component({
  selector: "app-email-verify",
  template: "",
  styles: []
})
export class EmailVerifyComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    Notiflix.Loading.Pulse("We're verifying your email...");
    this.verifyEmail();
  }
  private verifyEmail() {
    this.route.queryParams.subscribe(params => {
      const { token } = params;
      if (token) this.verifyEmailToken(token);

      this.router.navigate(["/account/login"]);
    });
  }
  private verifyEmailToken(token: any) {
    this.authService.verifyEmail(token).subscribe(() => {
      const { emailConfirmKey } = authConstants;
      this.router.navigate(["/account/login"], { queryParams: { [emailConfirmKey]: false } });
      Notiflix.Loading.Remove();
      NotifyService.notify({
        message: "Your email has been verified. You may now login",
        title: "<strong>Congratulations</strong>",
        icon: "check",
        notifyType: "success"
      });
    });
  }
}
