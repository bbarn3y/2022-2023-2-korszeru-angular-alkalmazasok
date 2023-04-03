import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ClientService} from "@services/client.service";
import {RouterService} from "@services/router.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private clientService: ClientService,
              private fb: FormBuilder,
              private routerService: RouterService) {
    this.loginForm = fb.group({
      mail: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required, Validators.pattern('[0-9]{7}')])
    });
  }

  login() {
    this.clientService.login(
      this.loginForm.get('mail')?.value,
      this.loginForm.get('password')?.value
    ).subscribe((response) => {
      console.log(response);
      this.routerService.routeToAuthenticated();
    })
  }

}
