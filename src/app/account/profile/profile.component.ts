import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NotifyService } from "@shared/services/notify.service";
import { Observable, of, throwError } from "rxjs";
import { catchError, share, tap, map } from "rxjs/operators";

import { AuthService, CurrentUser } from "../../auth/auth.service";
import { AccountService, UpdateUserDto } from "../account.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  currentUser: CurrentUser;
  profileForm: FormGroup;
  user$: Observable<UpdateUserDto>;
  file: File;
  isUpdating = false;
  fileName: string;
  cachedUser: UpdateUserDto;
  constructor(private authService: AuthService, private accountService: AccountService, private fb: FormBuilder) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.user$ = this.accountService.getProfile().pipe(
      share(),
      tap(user => {
        this.cachedUser = user;
        this.initForm(user);
      })
    );
    this.initForm(this.cachedUser);
  }
  private initForm(user: UpdateUserDto) {
    this.profileForm = this.fb.group({
      firstName: [user && user.firstName, [Validators.required, Validators.maxLength(64)]],
      lastName: [user && user.lastName, [Validators.required, Validators.maxLength(64)]],
      postalCode: [user && user.postalCode, [Validators.maxLength(12)]],
      city: [user && user.city, [Validators.maxLength(64)]],
      country: [user && user.country, [Validators.maxLength(64)]],
      phoneNumber: [user && user.phoneNumber, [Validators.maxLength(32)]],
      description: [user && user.description, [Validators.maxLength(255)]],
      address: [user && user.address, [Validators.maxLength(255)]],
      profileImage: [null]
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) return;
    NotifyService.dismissAll();
    this.isUpdating = true;
    const input: UpdateUserDto = this.profileForm.value;
    const inputDto = this.file ? this.toFormData({ ...input, profileImage: this.file }) : input;

    this.user$ = this.accountService.updateProfile(inputDto).pipe(
      share(),
      tap(user => {
        this.cachedUser = user;
        this.initForm(user);
        this.isUpdating = false;
        this.fileName = null;
        this.file = null;
        NotifyService.notify({
          message: "Profile updated successfully",
          notifyType: "success",
          icon: "check"
        });
      }),
      catchError(err => {
        this.user$ = of(this.cachedUser);
        this.isUpdating = false;
        return throwError(err);
      })
    );
  }

  onFileSelect = (event: FileList) => {
    this.file = event && event.item(0);
    this.fileName = this.file.name;
  };
  onClickFileUpload = () => $("#file").click();

  private toFormData = <T>(formValue: T) => {
    const formData = new FormData();

    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, value);
    }
    return formData;
  };
}
