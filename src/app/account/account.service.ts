import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseResDto } from "@shared/DTOs/base-response.dto";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

import { AuthService } from "../auth/auth.service";

export interface UpdateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  postalCode: number;
  city: string;
  country: string;
  description: string;
  address: string;
  phoneNumber: string;
  profileImage: string;
}
export interface UserDto extends UpdateUserDto, BaseResDto {}
@Injectable({
  providedIn: "root"
})
export class AccountService extends BaseService {
  constructor(protected http: HttpClient, private authService: AuthService) {
    super(http);
  }

  updateProfile(input): Observable<UpdateUserDto> {
    return this.update(input, `/users/${this.authService.getCurrentUser()?.userId}`);
  }
  getProfile(): Observable<UpdateUserDto> {
    return this.find(`/users/${this.authService.getCurrentUser()?.userId}`, {});
  }
}
