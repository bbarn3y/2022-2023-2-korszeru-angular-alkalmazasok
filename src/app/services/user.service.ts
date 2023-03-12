import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  tokenKey: string = 'sessionToken'
  token: string | null;

  constructor(private cookieService: CookieService) {
    this.token = localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const tokenFromCookie = this.cookieService.get('test');
    console.log('isLoggedIn', tokenFromCookie)
    return !!tokenFromCookie;
  }

  setToken(token: string): void {
    // localStorage.setItem(this.tokenKey, token);
    this.cookieService.set('test', token);
    this.token = token;
  }
}
