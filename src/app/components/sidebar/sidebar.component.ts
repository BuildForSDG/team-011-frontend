import { Component, OnInit } from '@angular/core';

import { AuthService, CurrentUser } from '../../auth/auth.service';

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
  {
    path: '/dashboard/marketplace',
    title: 'Marketplace',
    icon: 'shopping_cart',
    class: '',
    excludeRoles: ['Admin']
  },
  {
    path: '/dashboard/lands',
    title: 'Manage Lands',
    icon: 'construction',
    class: '',
    excludeRoles: ['Farmer', 'Admin']
  },
  {
    path: '/dashboard/transactions',
    title: 'Transactions',
    icon: 'double_arrow',
    class: 'text-rose'
  },
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
  currentUser: CurrentUser;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.currentUser = this.authService.getCurrentUser();
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
