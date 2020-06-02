import { Component, OnInit } from '@angular/core';

import { AuthService, DecodedAccessToken } from '../../auth/auth.service';

declare const $: any;

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  excludeRoles?: string[];
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard/home', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: '/dashboard/land', title: 'Manage Lands', icon: 'landscape', class: '', excludeRoles: ['Farmer', 'Admin'] },

  {
    path: '/dashboard/user-profile',
    title: 'User Profile',
    icon: 'person',
    class: ''
  }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: RouteInfo[];
  jwt: DecodedAccessToken;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.jwt = this.authService.getDecodedAccessToken();
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
