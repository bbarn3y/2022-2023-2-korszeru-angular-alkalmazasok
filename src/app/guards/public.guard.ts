import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {UserService} from "src/app/services/user.service";
import {RouterService} from "src/app/services/router.service";

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {

  constructor(private routerService: RouterService,
              private userService: UserService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.userService.isLoggedIn()) {
      this.routerService.routeToAuthenticated();
      return of(false);
    } else {
      return of(true);
    }
  }

}
