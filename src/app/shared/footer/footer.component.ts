import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  test: Date = new Date();

  constructor(private router: Router) {}

  getPath() {
    return this.router.url;
  }
}
