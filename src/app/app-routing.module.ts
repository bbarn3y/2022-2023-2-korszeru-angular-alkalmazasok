import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "src/app/login/login.component";
import {AuthenticatedComponent} from "src/app/authenticated/authenticated.component";
import {PageRoutes} from "src/app/_constants/page.routes";
import {PublicGuard} from "src/app/_guards/public.guard";
import {SessionGuard} from "src/app/_guards/session.guard";

const routes: Routes = [
  {
    path: PageRoutes.login,
    component: LoginComponent,
    canActivate: [PublicGuard]
  },
  {
    path: PageRoutes.authenticated,
    component: AuthenticatedComponent,
    canActivate: [SessionGuard],
    canActivateChild: [SessionGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
