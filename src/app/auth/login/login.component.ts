import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Notiflix from "notiflix-angular";
import { LocalStoreService } from "src/app/shared/services/local-store.service";
import { Toast } from "@shared/services/toast";

import { LoginInput } from "../auth.dto";
import { AuthService } from "../auth.service";
import { authConstants } from "../constants";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  resendVerificationForm: FormGroup;
  isUserRegistered: boolean;
  returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,

    private readonly localStore: LocalStoreService
  ) {}
  ngOnInit(): void {
    this.notifyFreshSignup();
    this.form = this.fb.group({
      email: ["", [Validators.email, Validators.required, Validators.maxLength(32)]],
      password: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(24)]]
    });
    this.resendVerificationForm = this.fb.group({
      email: ["", [Validators.email, Validators.required, Validators.maxLength(32)]]
    });
    // get return url from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/dashboard";
  }
  onSubmit() {
    Notiflix.Loading.Pulse();
    const input: LoginInput = this.form.value;
    this.authService.login(input).subscribe(res => {
      this.localStore.storeAccessToken(res.accessToken);
      Toast.dismissAll();
      this.router.navigateByUrl(this.returnUrl);
      Notiflix.Loading.Remove();
    });
  }
  onResend() {
    this.modalService.dismissAll();
    Toast.dismissAll();
    this.localStore.disableCaching();
    const email = this.resendVerificationForm.value.email;
    this.authService.resendEmailVerification(email).subscribe(() => {
      Toast.notify({
        message:
          "We've sent a fresh verification link to your email. Please check your inbox, if you can't find it there then it should be in your <b>junk</b>",
        icon: "forward_to_inbox",
        notifyType: "success"
      });
    });
  }
  onClickResend(resendModal: any) {
    this.resendVerificationForm.reset();
    this.modalService.open(resendModal, { centered: true });
  }

  private notifyFreshSignup() {
    const { emailConfirmKey } = authConstants;
    this.route.queryParams.subscribe(params => {
      if (params[emailConfirmKey] === "true") {
        Toast.notify({
          message:
            "We've sent a confirmation email to you. Please check your inbox, if you can't find it there then it should be in your <b>junk</b>",
          title: "<strong>Welcome Aboard</strong>",
          icon: "forward_to_inbox",
          delay: 10,
          showProgressBar: true,
          notifyType: "success"
        });
      }
    });
  }
}
