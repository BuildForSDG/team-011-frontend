import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [null, [Validators.required, Validators.maxLength(32)]],
      lastName: [null, [Validators.required, Validators.maxLength(32)]],
      customerType: [null, Validators.required],
      email: [
        null,
        [Validators.required, Validators.email, Validators.maxLength(32)],
      ],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(32),
        ],
      ],
      userType: [null, Validators.required],
    });
  }

  onSubmit() {}
}
