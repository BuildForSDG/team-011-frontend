import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"]
})
export class AuthComponent implements OnInit, OnDestroy {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    this.document.body.classList.add("login-page");
    this.document.body.classList.add("sidebar-collapse");
  }
  ngOnDestroy(): void {
    this.document.body.classList.remove("login-page");
    this.document.body.classList.remove("sidebar-collapse");
  }
}
