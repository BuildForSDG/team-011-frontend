import { Component, OnInit } from '@angular/core';
import { AuthService, DecodedAccessToken } from '../auth/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  jwt: DecodedAccessToken;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.jwt = this.authService.getDecodedAccessToken();
  }
}
