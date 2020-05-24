import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
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
    });
  }

  onSubmit() {}
}
