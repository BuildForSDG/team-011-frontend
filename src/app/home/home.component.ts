import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  contactForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  async ngOnInit(): Promise<void> {
    this.contactForm = this.fb.group({
      name: [null, [Validators.required, Validators.max(64)]],
      email: [null, [Validators.required, Validators.max(64), Validators.email]],
      message: [null, [Validators.required, Validators.max(255)]]
    });
  }
  onSubmit() {}
}
