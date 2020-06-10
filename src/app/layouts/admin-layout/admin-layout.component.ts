import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from "@angular/core";
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from "@angular/common";
import "rxjs/add/operator/filter";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import PerfectScrollbar from "perfect-scrollbar";
import * as $ from "jquery";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.css"]
})
export class AdminLayoutComponent implements OnInit {
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
  constructor(public location: Location, private router: Router, private authService: AuthService) {}
  // ngOnDestroy(): void {
  //   document.getElementById('theme').setAttribute('href', './assets/css/material-kit.min.css');
  // }

  ngOnInit() {
    const isWindows = navigator.platform.indexOf("Win") > -1 ? true : false;
    // document.getElementById('theme').setAttribute('href', './assets/css/material-dashboard.min.css');
    if (isWindows && !document.getElementsByTagName("body")[0].classList.contains("sidebar-mini")) {
      // if we are on windows OS we activate the perfectScrollbar function

      document.getElementsByTagName("body")[0].classList.add("perfect-scrollbar-on");
    } else {
      document.getElementsByTagName("body")[0].classList.remove("perfect-scrollbar-off");
    }
    const elemMainPanel = document.querySelector(".main-panel") as HTMLElement;
    const elemSidebar = document.querySelector(".sidebar .sidebar-wrapper") as HTMLElement;

    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event.url != this.lastPoppedUrl) {
          this.yScrollStack.push(window.scrollY);
        }
      } else if (event instanceof NavigationEnd) {
        if (event.url == this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        } else {
          window.scrollTo(0, 0);
        }
      }
    });
    this._router = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        elemMainPanel.scrollTop = 0;
        elemSidebar.scrollTop = 0;
      });
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      let ps = new PerfectScrollbar(elemMainPanel);
      ps = new PerfectScrollbar(elemSidebar);
    }

    const window_width = $(window).width();
    const $sidebar = $(".sidebar");
    const $sidebar_responsive = $("body > .navbar-collapse");
    const $sidebar_img_container = $sidebar.find(".sidebar-background");

    if (window_width > 767) {
      if ($(".fixed-plugin .dropdown").hasClass("show-dropdown")) {
        $(".fixed-plugin .dropdown").addClass("open");
      }
    }

    $(".fixed-plugin a").click(function (event) {
      // Alex if we click on switch, stop propagation of the event, so the dropdown will not be hide, otherwise we set the  section active
      if ($(this).hasClass("switch-trigger")) {
        if (event.stopPropagation) {
          event.stopPropagation();
        } else if (window.event) {
          window.event.cancelBubble = true;
        }
      }
    });

    $(".fixed-plugin .badge").click(function () {
      const $full_page_background = $(".full-page-background");

      $(this).siblings().removeClass("active");
      $(this).addClass("active");

      const new_color = $(this).data("color");

      if ($sidebar.length !== 0) {
        $sidebar.attr("data-color", new_color);
      }

      if ($sidebar_responsive.length != 0) {
        $sidebar_responsive.attr("data-color", new_color);
      }
    });

    $(".fixed-plugin .img-holder").click(function () {
      const $full_page_background = $(".full-page-background");

      $(this).parent("li").siblings().removeClass("active");
      $(this).parent("li").addClass("active");

      const new_image = $(this).find("img").attr("src");

      if ($sidebar_img_container.length !== 0) {
        $sidebar_img_container.fadeOut("fast", () => {
          $sidebar_img_container.css("background-image", 'url("' + new_image + '")');
          $sidebar_img_container.fadeIn("fast");
        });
      }

      if ($full_page_background.length !== 0) {
        $full_page_background.fadeOut("fast", () => {
          $full_page_background.css("background-image", 'url("' + new_image + '")');
          $full_page_background.fadeIn("fast");
        });
      }

      if ($sidebar_responsive.length !== 0) {
        $sidebar_responsive.css("background-image", 'url("' + new_image + '")');
      }
    });
  }
  ngAfterViewInit() {
    this.runOnRouteChange();
  }
  isMaps(path: string) {
    let title = this.location.prepareExternalUrl(this.location.path());
    title = title.slice(1);
    if (path === title) {
      return false;
    } else {
      return true;
    }
  }
  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemMainPanel = document.querySelector(".main-panel") as HTMLElement;
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }
  isMac(): boolean {
    let bool = false;
    if (navigator.platform.toUpperCase().indexOf("MAC") >= 0 || navigator.platform.toUpperCase().indexOf("IPAD") >= 0) {
      bool = true;
    }
    return bool;
  }
}
