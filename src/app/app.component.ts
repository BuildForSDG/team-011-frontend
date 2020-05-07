import {
  Component,
  OnInit,
  Inject,
  Renderer2,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { DOCUMENT } from '@angular/common';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  didScroll: boolean;
  lastScrollTop = 0;
  delta = 5;
  navbarHeight = 0;
  private subscription: Subscription;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    @Inject(DOCUMENT) private document: any,
    private element: ElementRef,
    public location: Location
  ) {}

  ngOnInit() {
    const navbar: HTMLElement = this.element.nativeElement.children[0]
      .children[0];
    this.subscription = this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe((_: NavigationEnd) => {
        if (window.outerWidth > 991) {
          window.document.children[0].scrollTop = 0;
        } else {
          window.document.activeElement.scrollTop = 0;
        }
        this.renderer.listen('window', 'scroll', (scrollEvent: any) => {
          const num = window.scrollY;
          if (num > 150 || window.pageYOffset > 150) {
            // add logic
            navbar.classList.add('headroom--not-top');
          } else {
            // remove logic
            navbar.classList.remove('headroom--not-top');
          }
        });
      });
    this.hasScrolled();
  }

  @HostListener('window:scroll', ['$event'])
  hasScrolled() {
    const st = window.pageYOffset;
    // Make sure they scroll more than delta
    if (Math.abs(this.lastScrollTop - st) <= this.delta) {
      return;
    }

    const navbar = document.getElementsByTagName('nav')[0];

    // If they scrolled down and are past the navbar, add class .headroom--unpinned.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > this.lastScrollTop && st > this.navbarHeight) {
      // Scroll Down
      if (navbar.classList.contains('headroom--pinned')) {
        navbar.classList.remove('headroom--pinned');
        navbar.classList.add('headroom--unpinned');
      }
      // $('.navbar.headroom--pinned').removeClass('headroom--pinned').addClass('headroom--unpinned');
    } else {
      // Scroll Up
      //  $(window).height()
      if (st + window.innerHeight < document.body.scrollHeight) {
        // $('.navbar.headroom--unpinned').removeClass('headroom--unpinned').addClass('headroom--pinned');
        if (navbar.classList.contains('headroom--unpinned')) {
          navbar.classList.remove('headroom--unpinned');
          navbar.classList.add('headroom--pinned');
        }
      }
    }

    this.lastScrollTop = st;
  }
}
