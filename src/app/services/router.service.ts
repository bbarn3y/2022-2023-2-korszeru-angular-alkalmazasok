import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(private router: Router) { }

  routeToAuthenticated(): void {
    this.router.navigateByUrl('/authenticated')
  }

  routeToLogin(): void {
    this.router.navigateByUrl('/login')
  }

}
