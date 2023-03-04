import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageRoutes} from "src/app/_constants/page.routes";
import {LoginComponent} from "src/app/login/login.component";
import {AuthenticatedComponent} from "src/app/authenticated/authenticated.component";

const routes: Routes = [
  {
    path: PageRoutes.authenticated,
    component: AuthenticatedComponent
  },
  {
    path: PageRoutes.login,
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: `/${PageRoutes.login}`,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
