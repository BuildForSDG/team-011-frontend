import { map } from "rxjs/operators";
import { Location } from "@angular/common";
import { Component, ElementRef, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationDto } from "@shared/DTOs/notification.dto";
import { PagedRes } from "@shared/DTOs/paged-response.dto";
import { IoService } from "@shared/services/io.service";
import { NotifyService } from "@shared/services/notify.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { AuthService, CurrentUser } from "../../auth/auth.service";
import { ROUTES } from "../sidebar/sidebar.component";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  private listTitles: any[];
  location: Location;
  mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  currentUser: CurrentUser;
  notifications: NotificationDto[] = [];
  pagedNotif: PagedRes<NotificationDto>;

  constructor(
    location: Location,
    private element: ElementRef,
    private authService: AuthService,
    private router: Router,
    private notifyService: NotifyService,
    private ioService: IoService
  ) {
    this.location = location;
    this.sidebarVisible = false;
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggler")[0];
    this.router.events.subscribe(event => {
      this.sidebarClose();
      const $layer: any = document.getElementsByClassName("close-layer")[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });
    this.notifyService
      .getNotifications({ skip: 0, limit: 100, query: { to: this.currentUser.userId } })
      .subscribe(data => (this.notifications = data.items));
    this.notifyService.notifications.subscribe(notifs => {
      this.notifications = notifs;
    });
    this.ioService.getNotification().subscribe(notification => {
      if (this.currentUser.userId === notification.to && !this.notifications.find(x => x.id === notification.id)) {
        this.notifications.unshift(notification);
        this.notifyService.notifications.next(this.notifications);
      }
    });
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName("body")[0];
    setTimeout(() => {
      toggleButton.classList.add("toggled");
    }, 500);

    body.classList.add("nav-open");

    this.sidebarVisible = true;
  }
  sidebarClose() {
    const body = document.getElementsByTagName("body")[0];
    this.toggleButton.classList.remove("toggled");
    this.sidebarVisible = false;
    body.classList.remove("nav-open");
  }
  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    const $toggle = document.getElementsByClassName("navbar-toggler")[0];

    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const body = document.getElementsByTagName("body")[0];

    if (this.mobile_menu_visible === 1) {
      // $('html').removeClass('nav-open');
      body.classList.remove("nav-open");
      if ($layer) {
        $layer.remove();
      }
      setTimeout(() => {
        $toggle.classList.remove("toggled");
      }, 400);

      this.mobile_menu_visible = 0;
    } else {
      setTimeout(() => {
        $toggle.classList.add("toggled");
      }, 430);

      var $layer = document.createElement("div");
      $layer.setAttribute("class", "close-layer");

      if (body?.querySelectorAll(".main-panel")) {
        document.getElementsByClassName("main-panel")[0].appendChild($layer);
      } else if (body.classList.contains("off-canvas-sidebar")) {
        document.getElementsByClassName("wrapper-full-page")[0].appendChild($layer);
      }

      setTimeout(() => {
        $layer.classList.add("visible");
      }, 100);

      $layer.onclick = function () {
        // assign a function
        body.classList.remove("nav-open");
        this.mobile_menu_visible = 0;
        $layer.classList.remove("visible");
        setTimeout(() => {
          $layer.remove();
          $toggle.classList.remove("toggled");
        }, 400);
      }.bind(this);

      body.classList.add("nav-open");
      this.mobile_menu_visible = 1;
    }
  }
  onClickLogout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(["/account/login"]);
    });
  }
  getTitle() {
    let title = this.location.prepareExternalUrl(this.location.path());
    if (title.charAt(0) === "#") {
      title = title.slice(1);
    }

    for (let item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === title) {
        return this.listTitles[item].title;
      }
    }
    return "Dashboard";
  }
}
