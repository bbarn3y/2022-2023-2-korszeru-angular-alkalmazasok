import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = fb.group({
      mail: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.pattern(`[0-9]*`), Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  login() {

  }

}
