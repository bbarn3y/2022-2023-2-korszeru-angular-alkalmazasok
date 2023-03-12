import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "src/app/login/login.component";
import {AuthenticatedComponent} from "src/app/authenticated/authenticated.component";
import {SessionGuard} from "src/app/guards/session.guard";
import {PublicGuard} from "src/app/guards/public.guard";

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [PublicGuard]
  },
  {
    path: 'authenticated',
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
