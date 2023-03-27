import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  isLoggedIn: boolean;
  sessionKey = 'session';

  constructor(private cookieService: CookieService) {
    // this.isLoggedIn = !!localStorage.getItem(this.sessionKey);
    this.isLoggedIn = !!this.cookieService.get(this.sessionKey);
  }

  removeSession(): void {
    this.cookieService.delete(this.sessionKey);
    this.isLoggedIn = false;
  }

  saveSession(token: string): void {
    // localStorage.setItem(this.sessionKey, token);
    this.cookieService.set(this.sessionKey, token);
    this.isLoggedIn = true;
  }


}
